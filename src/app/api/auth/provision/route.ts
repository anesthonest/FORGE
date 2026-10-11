import { APIEngine } from "@/lib/core/api-engine";
import { getServerFirebase } from "@/lib/firebase/server";
import { BillingEngine } from "@/lib/billing-engine";
import { z } from "zod";

/**
 * @fileOverview Forge OS Identity Provisioning API (Hardened v4)
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 * 
 * Securely initializes a new operator's industrial profile and billing identity.
 * Persists legal consent versions to ensure compliance auditability.
 */

export const runtime = "nodejs";

const ProvisionSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  name: z.string().optional(),
  legalConsent: z.object({
    acceptedTerms: z.boolean(),
    acceptedPrivacy: z.boolean(),
    version: z.string()
  }).optional()
});

export async function POST(req: Request) {
  try {
    const { data, error } = await APIEngine.validate(req, ProvisionSchema);
    if (error) return APIEngine.error(error, "INVALID_INPUT", 400);

    const { uid, email, name, legalConsent } = data!;
    const { db, admin } = getServerFirebase();
    if (!db) return APIEngine.error("Infrastructure offline.", "DB_ERROR");

    const userRef = db.collection("users").doc(uid);
    const snap = await userRef.get();

    if (snap.exists) {
      return APIEngine.success({ status: "STABLE", billingId: snap.data()?.billingId });
    }

    // 1. GENERATE IMMUTABLE BILLING IDENTITY
    const billingId = BillingEngine.generateBillingId(uid);

    // 2. ATOMIC PROFILE PROVISIONING
    const newProfile = {
      uid,
      email,
      name: name || email.split('@')[0],
      billingId,
      stripeCustomerId: null, 
      mobileMoneyId: null,
      plan: "free",
      subscriptionStatus: "active", 
      role: "user",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      acceptedTerms: legalConsent?.acceptedTerms || true,
      acceptedPrivacy: legalConsent?.acceptedPrivacy || true,
      legalVersion: legalConsent?.version || "1.0",
      analytics: {
        aiTokens: 0,
        workflowCount: 0,
        revenueSeries: [0,0,0,0,0,0,0],
        workflowSeries: [0,0,0,0,0,0,0],
        computeIntensity: 0,
        totalRevenue: 0
      },
      wallet: {
        balance: 0,
        cvuCredits: 100, // Initial grant
        spent: 0,
        earned: 0
      }
    };

    await userRef.set(newProfile);

    // 3. LOG ACCOUNT CREATION EVENT
    await db.collection('forge_events').add({
      uid,
      userId: uid,
      billingId,
      type: 'auth_action',
      action: 'account_created',
      status: 'success',
      category: 'auth',
      metadata: { plan: 'free', legalVersion: newProfile.legalVersion },
      source: 'Provision_Engine',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      verified: true
    });

    console.info(`[FORGE-IDENTITY] Provisioned: ${uid} | BillingID: ${billingId}`);

    return APIEngine.success({ 
      status: "PROVISIONED", 
      billingId,
      plan: "free"
    });

  } catch (err: any) {
    console.error("[FORGE-PROVISION-FAULT]", err.message);
    return APIEngine.error(err.message, "PROVISION_FAILED");
  }
}