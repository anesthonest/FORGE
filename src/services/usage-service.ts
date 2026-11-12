/**
 * @fileOverview Forge OS Usage Intelligence Service (Phase 2 Hardened)
 * Monitors AI consumption and enforces tier-based monthly rate limits.
 */

import { getServerFirebase } from '@/lib/firebase/server';

export type UserPlan = 'FREE' | 'PRO' | 'PREMIUM' | 'ELITE' | 'PRO_ENTERPRISE' | 'PREMIUM_ENTERPRISE' | 'ELITE_ENTERPRISE';

export const PLAN_LIMITS: Record<string, number> = {
  'FREE': 100,
  'PRO': 5000,
  'PREMIUM': 25000,
  'ELITE': 100000,
  'PRO_ENTERPRISE': 250000,
  'PREMIUM_ENTERPRISE': 1000000,
  'ELITE_ENTERPRISE': 10000000 // Fair use
};

export interface UsageReport {
  tokensUsed: number;
  requestCount: number;
  costEstimate: number;
  isAllowed: boolean;
  remainingRequests: number;
  plan: string;
}

/**
 * Validates if an operator has sufficient monthly quota for an AI reasoning task.
 */
export async function checkUsageQuota(userId: string): Promise<UsageReport> {
  const { db } = getServerFirebase();
  if (!db) throw new Error("Database offline");

  const userRef = db.collection('users').doc(userId);
  const userSnap = await userRef.get();
  
  if (!userSnap.exists) throw new Error("User not found");
  const userData = userSnap.data()!;
  
  const plan = (userData.plan || 'FREE').toUpperCase();
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const usageRef = userRef.collection('usage').doc(currentMonth);
  const usageSnap = await usageRef.get();

  const currentUsage = usageSnap.exists ? usageSnap.data()!.count : 0;
  
  return {
    tokensUsed: usageSnap.exists ? usageSnap.data()!.tokens : 0,
    requestCount: currentUsage,
    costEstimate: usageSnap.exists ? usageSnap.data()!.cost : 0,
    isAllowed: currentUsage < limit,
    remainingRequests: Math.max(0, limit - currentUsage),
    plan
  };
}

/**
 * Records an AI execution pulse with high-fidelity cost metering.
 */
export async function recordExecution(userId: string, provider: string, tokens: number, cost: number) {
  const { db, admin } = getServerFirebase();
  if (!db) return;

  const currentMonth = new Date().toISOString().slice(0, 7);
  const batch = db.batch();

  // 1. Log to Global Audit Ledger
  const logRef = db.collection('audit_logs').doc();
  batch.set(logRef, {
    userId,
    action: 'AI_REQUEST',
    provider,
    tokensUsed: tokens,
    costEstimate: cost,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    status: 'success'
  });

  // 2. Increment Monthly User Telemetry
  const usageRef = db.collection('users').doc(userId).collection('usage').doc(currentMonth);
  batch.set(usageRef, {
    count: admin.firestore.FieldValue.increment(1),
    tokens: admin.firestore.FieldValue.increment(tokens),
    cost: admin.firestore.FieldValue.increment(cost),
    lastRequestAt: admin.firestore.FieldValue.serverTimestamp(),
    month: currentMonth
  }, { merge: true });

  await batch.commit();
}
