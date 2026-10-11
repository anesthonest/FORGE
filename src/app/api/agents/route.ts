import { APIEngine } from '@/lib/core/api-engine';

/**
 * @fileOverview Forge OS Agent Registry & Metrics API
 */

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const agents = [
      { id: "AGT-001", name: "Architect-Prime", role: "Design", status: "busy", load: 82, region: "US-EAST", sync: 0.99 },
      { id: "AGT-002", name: "Coder-Alpha", role: "Implementation", status: "active", load: 12, region: "EU-WEST", sync: 1.0 },
      { id: "AGT-003", name: "Sentinel-Guard", role: "Security", status: "active", load: 45, region: "US-EAST", sync: 0.98 },
      { id: "AGT-004", name: "Warden-Policy", role: "Compliance", status: "active", load: 22, region: "APAC-SOUTH", sync: 1.0 },
      { id: "AGT-005", name: "QA-Sim-01", role: "Testing", status: "recovering", load: 0, region: "EU-WEST", sync: 0.85 },
      { id: "AGT-006", name: "Analyst-Omni", role: "Intelligence", status: "active", load: 15, region: "US-EAST", sync: 0.99 }
    ];

    return APIEngine.success(agents);
  } catch (error: any) {
    return APIEngine.error(error.message, "AGENT_LIST_FAULT");
  }
}
