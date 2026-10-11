import { APIEngine } from '@/lib/core/api-engine';
import { getServerFirebase } from '@/lib/firebase/server';

/**
 * @fileOverview Forge OS Global Analytics API (Server-Only Hardened)
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
    // Strictly use Admin SDK for server-side read
    const { db } = getServerFirebase();
    const userRef = db.collection('users').doc(userId);
    const snap = await userRef.get();
    
    let userData = snap.exists ? snap.data() : null;
    let analytics = userData?.analytics || {};

    const data = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      workflows: analytics.workflowSeries || [0, 0, 0, 0, 0, 0, 0],
      revenue: analytics.revenueSeries || [0, 0, 0, 0, 0, 0, 0],
      computeIntensity: analytics.computeIntensity || 0,
      metrics: {
        totalRevenue: analytics.totalRevenue || 0,
        throughput: analytics.workflowCount || 0,
        complianceScore: 1.0,
      },
      trace: {
        latency: `${Date.now() - startTime}ms`,
        source: "SERVER_ADMIN_MESH",
        path: `users/${userId}/analytics`
      }
    };

    return APIEngine.success(data);
  } catch (error: any) {
    console.error(`[FORGE-TRACE] Analytics fault:`, error.message);
    return APIEngine.error(error.message, "ANALYTICS_FAULT");
  }
}
