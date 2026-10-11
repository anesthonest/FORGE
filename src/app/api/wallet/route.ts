import { APIEngine } from '@/lib/core/api-engine';
import { getServerFirebase } from '@/lib/firebase/server';

/**
 * @fileOverview Forge OS Sovereign Wallet API (Server-Only Hardened)
 */

export const runtime = "nodejs";

export async function GET(req: Request) {
  const startTime = Date.now();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId || userId === 'undefined') {
    return APIEngine.error("Operator context missing.", "AUTH_REQUIRED", 401);
  }

  try {
    const { db } = getServerFirebase();
    const userRef = db.collection('users').doc(userId);
    const snap = await userRef.get();

    if (!snap.exists) {
      return APIEngine.success({
        balance: 0,
        cvuCredits: 0,
        spent: 0,
        earned: 0,
        currency: "USD",
        trace: { source: "PROVISION_PENDING", latency: `${Date.now() - startTime}ms` }
      });
    }

    const data = snap.data();
    return APIEngine.success({
      ...(data?.wallet || {}),
      trace: { 
        source: "SERVER_ADMIN_MESH", 
        userId, 
        path: `users/${userId}/wallet`,
        latency: `${Date.now() - startTime}ms` 
      }
    });
  } catch (error: any) {
    console.error(`[FORGE-INFRA] Wallet fetch fault:`, error.message);
    return APIEngine.error(error.message, "WALLET_FETCH_FAULT");
  }
}
