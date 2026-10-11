import { APIEngine } from '@/lib/core/api-engine';
import { PaymentRouter } from '@/lib/payment-router';
import { FORGE_PLANS, SubscriptionTier } from '@/lib/billing-engine';
import { getServerFirebase } from '@/lib/firebase/server';

/**
 * @fileOverview Forge OS Production Checkout API
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 * 
 * Initiates a secure tunnel to a regional settlement gateway.
 * Instrumented for end-to-end monetization flow.
 */

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, userId, region = 'US' } = body;

    if (!plan || !userId) {
      return APIEngine.error("Plan and User Context required.", "MISSING_PARAMS", 400);
    }

    const targetPlan = FORGE_PLANS[plan as SubscriptionTier];
    if (!targetPlan) {
      return APIEngine.error("Unrecognized licensing tier.", "INVALID_PLAN", 400);
    }

    // 1. Verify User Context & Retrieve Billing ID
    const { db, admin } = getServerFirebase();
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();
    
    if (!userSnap.exists) {
      return APIEngine.error("Operator not found in mesh.", "NOT_FOUND", 404);
    }

    const userData = userSnap.data();
    const billingId = userData?.billingId;

    // 2. Resolve Regional Payment Route
    const route = PaymentRouter.getRoute(region);
    
    // 3. Initiate Secure Session
    const sessionUrl = await PaymentRouter.initiateSession(userId, plan, region);

    // 4. Log Checkout Started Event
    await db.collection('forge_events').add({
      uid: userId,
      userId,
      billingId,
      type: 'billing_action',
      category: 'billing',
      action: 'checkout_started',
      status: 'pending',
      metadata: { plan, region, provider: route.provider },
      source: 'Checkout_Engine',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      verified: true
    });

    console.info(`[FORGE-ECONOMY] Checkout Session Created | User: ${userId} | Tier: ${plan}`);

    return APIEngine.success({
      checkoutUrl: sessionUrl,
      provider: route.provider,
      currency: route.pricing.currency,
      tier: plan,
      status: "TUNNEL_READY"
    });

  } catch (error: any) {
    console.error("[FORGE-CHECKOUT-FAULT]", error.message);
    return APIEngine.error(error.message, "CHECKOUT_INTERRUPT");
  }
}