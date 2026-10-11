import { APIEngine } from '@/lib/core/api-engine';
import { ecosystemMonitor } from '@/ai/core/ecosystem-monitor';
import { getProductionVitals } from '@/services/analytics-service';
import { getRecentIncidents } from '@/services/incident-service';

/**
 * @fileOverview Forge OS Monitoring & Health API
 * Provides high-fidelity system telemetry for the admin dashboard.
 */

export const runtime = "nodejs";

export async function GET(req: Request) {
  return APIEngine.executeProtected('system-admin', async (db) => {
    const vitals = await getProductionVitals();
    const incidents = await getRecentIncidents(5);
    const status = ecosystemMonitor.getStatus();
    const metrics = ecosystemMonitor.getMetrics();

    const dashboardData = {
      status,
      metrics: {
        ...metrics,
        dau: vitals.dau,
        mau: vitals.mau,
        errorRate: vitals.errorRate
      },
      incidents,
      timestamp: new Date().toISOString()
    };

    return APIEngine.success(dashboardData);
  });
}
