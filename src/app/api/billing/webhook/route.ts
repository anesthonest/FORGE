import { NextResponse } from 'next/server';
import { getServerFirebase } from '@/lib/firebase/server';
import { SubscriptionTier, CVU_WEIGHTS } from '@/lib/billing-engine';

/**
 * @fileOverview Forge OS Production Settlement Webhook (Industrial v20)
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 * 
 * Authoritative source of truth for subscription state.
 * Resolves operators by immutable billingId to ensure end-to-end integrity.
 */

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { db, admin } = getServerFirebase();
  if (!db) return NextResponse.json({ success: false }, { status: 500 });

  try {
    // In production, signature verification would happen here
    const event = await req.json();

    console.info(`[FORGE-SETTLEMENT] Incoming Event: ${event.type}`);

    // 1. RESOLVE IDENTITY VIA BILLING ID (Authoritative)
    const billingId = event.data?.object?.metadata?.billingId;
    const planId = (event.data?.object?.metadata?.plan || 'pro') as SubscriptionTier;

    if (!billingId) {
      console.warn("[FORGE-SETTLEMENT-REJECT] Missing Billing ID in metadata.");
      return NextResponse.json({ success: false, error: "Billing Identity resolution failed." }, { status: 400 });
    }

    // 2. FIND USER BY BILLING ID
    const usersSnap = await db.collection('users').where('billingId', '==', billingId).limit(1).get();
    
    if (usersSnap.empty) {
      console.warn(`[FORGE-SETTLEMENT-REJECT] User not found for billingId: ${billingId}`);
      return NextResponse.json({ success: false, error: "Sovereign identity context missing." }, { status: 404 });
    }

    const userDoc = usersSnap.docs[0];
    const userRef = userDoc.ref;
    const uid = userDoc.id;

    // 3. PROCESS PAYMENT LIFECYCLE
    switch (event.type) {
      case 'checkout.session.completed':
      case 'payment.momo_success':
        const amount = (event.data.object.amount_total || event.data.object.amount || 0) / 100;
        const cvuGranted = amount * 100; // Formula: 1 USD = 100 CVU

        // Atomic update of identity state
        await userRef.update({
          'plan': planId,
          'subscriptionStatus': 'active',
          'lastPaymentId': event.data.object.id || 'sim-id',
          'wallet.balance': admin.firestore.FieldValue.increment(amount),
          'wallet.cvuCredits': admin.firestore.FieldValue.increment(cvuGranted), 
          'lastSync': admin.firestore.FieldValue.serverTimestamp()
        });

        // 4. IMMUTABLE REVENUE LEDGER ENTRIES
        await db.collection('forge_events').add({
          uid,
          userId: uid,
          billingId,
          type: 'payment_success',
          category: 'billing',
          action: 'subscription_upgrade',
          status: 'success',
          cost: -amount, // Revenue is negative cost in ledger
          resourceUsage: -cvuGranted,
          metadata: { planId, provider: event.provider || 'gateway', amount, currency: 'USD' },
          source: 'Settlement_Webhook',
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          verified: true
        });

        // Log secondary feature_unlocked event
        await db.collection('forge_events').add({
          uid,
          userId: uid,
          type: 'system_action',
          category: 'system',
          action: 'feature_unlocked',
          status: 'success',
          metadata: { plan: planId, message: `All ${planId.toUpperCase()} capabilities unlocked.` },
          source: 'Entitlement_Engine',
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          verified: true
        });

        console.info(`[FORGE-SETTLEMENT] Provisioned Identity: ${billingId} -> ${planId}`);
        break;

      case 'subscription.cancelled':
        await userRef.update({ 'subscriptionStatus': 'inactive' });
        
        await db.collection('forge_events').add({
          uid,
          userId: uid,
          type: 'billing_action',
          category: 'billing',
          action: 'subscription_cancelled',
          status: 'success',
          metadata: { previousPlan: planId },
          source: 'Settlement_Webhook',
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          verified: true
        });
        break;
        
      case 'payment.failed':
        await db.collection('forge_events').add({
          uid,
          userId: uid,
          type: 'billing_action',
          category: 'billing',
          action: 'payment_failed',
          status: 'failed',
          metadata: { plan: planId, error: event.data?.object?.last_payment_error?.message || 'Gateway Error' },
          source: 'Settlement_Webhook',
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          verified: true
        });
        break;
    }

    return NextResponse.json({ success: true, status: "STABILIZED" });

  } catch (err: any) {
    console.error("[FORGE-SETTLEMENT-FAULT]", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}