import { APIEngine } from '@/lib/core/api-engine';
import { getServerFirebase } from '@/lib/firebase/server';
import { FORGE_PLANS, SubscriptionTier } from '@/lib/billing-engine';

/**
 * @fileOverview Forge OS Billing Status API
 */

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return APIEngine.error("UserID required", "MISSING_UID", 400);
  }

  try {
    const { db } = getServerFirebase();
    const userRef = db.collection('users').doc(userId);
    const snap = await userRef.get();
    
    if (!snap.exists) return APIEngine.error("User context missing", "NOT_FOUND", 404);
    
    const data = snap.data();
    const tier = (data?.plan || 'free') as SubscriptionTier;
    const usage = data?.analytics || { aiTokens: 0, workflowCount: 0 };
    const limits = FORGE_PLANS[tier];

    const statusData = {
      tier,
      usage,
      limits,
      health: usage.aiTokens < (limits.dailyAIQuota * 1000) * 0.9,
      timestamp: new Date().toISOString()
    };

    return APIEngine.success(statusData);

  } catch (error: any) {
    return APIEngine.error(error.message, "STATUS_FETCH_FAULT");
  }
}
