import { forgeGenerate } from "./model-router";
import { MODELS } from "./model-registry";
import { safeParseJSON } from "./self-healing-engine";

/**
 * @fileOverview ForgeOS Safe Patch Engine (v10)
 * Generates incremental, high-integrity remediations for architectural gaps.
 */

export interface ArchitecturePatch {
  id: string;
  reason: string;
  target_module: string;
  proposed_logic: string;
  risk_level: "low" | "medium" | "high";
  rollback_strategy: string;
}

export class SafePatchEngine {
  /**
   * Generates a deterministic remediation for a detected structural weakness.
   */
  static async proposePatch(weakness: string, context: string): Promise<ArchitecturePatch> {
    console.info(`[FORGE-PATCHER] Designing remediation for: ${weakness}`);

    const prompt = `Generate a safe architectural patch for the following weakness: ${weakness}.
Context: ${context}

RULES:
- Patch must be incremental.
- No modifications to core systems (/src/ai/core/*).
- Must include a rollback plan.

Return ONLY valid JSON.
{
  "reason": "string",
  "target_module": "string",
  "proposed_logic": "string",
  "risk_level": "low" | "medium" | "high",
  "rollback_strategy": "string"
}`;

    const { text } = await forgeGenerate(MODELS.GPT4O_MINI, prompt, "architecture");
    
    const patch = safeParseJSON<any>(text, {
      reason: "Recovery needed",
      target_module: "unknown",
      proposed_logic: "",
      risk_level: "high",
      rollback_strategy: "Manual restore"
    });

    return {
      ...patch,
      id: `patch-${Math.random().toString(36).substr(2, 9)}`,
    };
  }
}
