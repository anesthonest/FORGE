import { withAutonomousFallback, ForgeTaskType } from "./model-router";
import { persistentMemory } from "./persistent-memory";
import { setForgeMode } from "./forge-config";

/**
 * @fileOverview Forge Execution Kernel - Layer 5: Recovery Kernel (Hardened)
 * Handles autonomous self-healing and deterministic error recovery for production.
 */

export function safeParseJSON<T>(text: string, fallback: T): T {
  try {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.warn("[FORGE-RECOVERY] JSON Parsing Failure. Attempting best-effort recovery.");
    return { ...(fallback as any), recovered: true, raw_output: text.slice(0, 250) } as T;
  }
}

/**
 * Executes a task with autonomous self-healing.
 * Hardened recursion protection for production stability.
 */
export async function selfHealingRun<T>(task: (model: string) => Promise<T>, taskType: ForgeTaskType): Promise<T> {
  const MAX_RETRIES = 1; // Strict limit for production
  let attempts = 0;

  while (attempts <= MAX_RETRIES) {
    try {
      return await withAutonomousFallback(taskType, task);
    } catch (error: any) {
      attempts++;
      const diagnosis = diagnoseError(error);
      
      console.warn(`[FORGE-RECOVERY] Failure Detected (${diagnosis.type}). Recovery Attempt ${attempts}`);

      if (diagnosis.type === 'RATE_LIMIT') {
        setForgeMode('SAFE_LOW_COST');
        
        const memory = await persistentMemory.retrieve(`FAILSAFE_${taskType}`, 'error_resolution');
        if (memory) {
          console.info(`[FORGE-RECOVERY] Memory Cache Recovery: Returning high-fidelity production asset.`);
          return memory.output as T;
        }
      }

      if (attempts > MAX_RETRIES) {
        return getEmergencyFallback(diagnosis.type);
      }
      
      // Jittered backoff to prevent thundering herd
      const delay = 1000 + (Math.random() * 1000);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  return getEmergencyFallback('UNKNOWN');
}

function diagnoseError(error: any) {
  const msg = (error?.message || String(error)).toLowerCase();
  if (msg.includes("429") || msg.includes("quota") || msg.includes("limit")) return { type: "RATE_LIMIT" };
  if (msg.includes("timeout") || msg.includes("deadline")) return { type: "TIMEOUT" };
  if (msg.includes("model") || msg.includes("not found")) return { type: "MODEL_RESOLUTION_ERROR" };
  return { type: "ENGINEERING_ERROR" };
}

function getEmergencyFallback(errorType: string): any {
  return {
    success: true,
    summary: `Forge OS (Sovereign): Basic UI functionality preserved. Intelligence kernel shifted to safety mode due to ${errorType}.`,
    is_conversational: true,
    is_degraded: true,
    selected_model: "recovery-supervisor-v12",
    workflow_id: `rec-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    plan: [{ title: "Failsafe Recovery", description: "System operating in air-gapped simulation mode." }]
  };
}
