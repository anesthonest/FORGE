'use server';

import { getServerFirebase } from '@/lib/firebase/server';
import { BillingEngine, SubscriptionTier } from '@/lib/billing-engine';

/**
 * @fileOverview Forge OS Industrial Usage Recorder (Hardened v8 - Server-Only)
 * Implements atomic field increments and persistent ledger entries via Admin SDK.
 * 
 * CRITICAL RULE: This file is strictly SERVER-SIDE. It never imports client Firebase.
 */

export async function recordUsage(userId: string, usage: {
  tokens?: number;
  workflows?: number;
  agents?: number;
  deployments?: number;
}, actionType: string = 'ai_task') {
  if (!userId || userId === 'undefined') return;

  try {
    const { db, admin } = getServerFirebase();
    if (!db) throw new Error("Server Mesh Infrastructure Offline");

    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();
    
    if (!userSnap.exists) return;
    
    const userData = userSnap.data()!;
    const tier = (userData.plan || 'free') as SubscriptionTier;

    // 1. Calculate CVU (Compute Value Units) via Industrial Logic
    const cvuConsumed = BillingEngine.calculateCVU(usage);
    const usdImpact = BillingEngine.calculateUSD(cvuConsumed, tier);

    // 2. ATOMIC STATE UPDATE (High Concurrency Safe via Admin SDK)
    await userRef.update({
      'analytics.aiTokens': admin.firestore.FieldValue.increment(usage.tokens || 0),
      'analytics.workflowCount': admin.firestore.FieldValue.increment(usage.workflows || 0),
      'wallet.cvuCredits': admin.firestore.FieldValue.increment(-cvuConsumed),
      'wallet.spent': admin.firestore.FieldValue.increment(usdImpact),
      'lastSync': admin.firestore.FieldValue.serverTimestamp()
    });

    // 3. PERSISTENT ECONOMY LEDGER ENTRY
    await db.collection('forge_events').add({
      uid: userId,
      userId, 
      type: actionType,
      cost: usdImpact,
      resourceUsage: cvuConsumed,
      metadata: { ...usage, tier },
      source: 'Server_Intelligence_Node',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      verified: true
    });

    console.info(`[FORGE-ECONOMY] Server Atomic Sync | User: ${userId.slice(0, 8)} | Impact: $${usdImpact.toFixed(6)}`);
  } catch (error: any) {
    console.error("[FORGE-ECONOMY-FAULT] Server ledger interrupt:", error.message);
  }
}
