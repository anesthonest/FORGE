import { APIEngine } from "@/lib/core/api-engine";
import { coreIntelligence } from "@/ai/core/core-intelligence";
import { checkUsageQuota } from "@/services/usage-service";
import { z } from "zod";

/**
 * @fileOverview Forge OS Consolidated AI Gateway (Hardened v3)
 * PROPERTY OF VINEXSAH TECHNOLOGIES.
 * 
 * Replaces redundant /api/forge-ai and enforces unified security governance.
 */

export const runtime = "nodejs";

const RunSchema = z.object({
  command: z.string().min(1, "Human intent 'command' is required."),
  userId: z.string().min(1, "Operator identity required."),
  taskType: z.string().optional().default('generation'),
});

export async function POST(req: Request) {
  const startTime = Date.now();
  
  const { data, error } = await APIEngine.validate(req, RunSchema);
  if (error) return APIEngine.error(error, "INVALID_INPUT", 400);
  
  const { command, userId } = data!;

  return APIEngine.executeProtected(userId, async (db, admin, userProfile) => {
    
    // 1. AUTHORITATIVE QUOTA CHECK
    const quota = await checkUsageQuota(userId);
    if (!quota.isAllowed) {
      return APIEngine.error(
        "Industrial Quota Exceeded. Upgrade to continue fabrication.", 
        "PLAN_LIMIT_REACHED", 
        403
      );
    }

    // 2. INDUSTRIAL INTELLIGENCE DISPATCH
    // Centralizes logic from redundant coreIntelligence entry points
    try {
      const result = await coreIntelligence(
        command, 
        userProfile.plan || 'free', 
        userProfile.role || 'user',
        userId
      );

      // 3. ENHANCED TELEMETRY (Audit Verified)
      return APIEngine.success({
        ...result,
        trace: {
          latency: `${Date.now() - startTime}ms`,
          operator: userId.slice(0, 8),
          gate: "CONSOLIDATED_GATEWAY_V3"
        }
      });

    } catch (aiError: any) {
      console.error("[FORGE-GATEWAY-FAULT]", aiError.message);
      
      await db.collection('system_errors').add({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        severity: 'CRITICAL',
        service: 'UNIFIED_GATEWAY',
        message: aiError.message,
        userId
      });

      return APIEngine.error("Autonomous Infrastructure Interrupt.", "GATEWAY_FAULT");
    }
  });
}
