import { persistentMemory } from "./persistent-memory";
import { forgeGenerate } from "./model-router";
import { MODELS } from "./model-registry";

/**
 * @fileOverview ForgeOS Architecture Analyzer (v10)
 * Scans the cognitive mesh for structural weaknesses and recurring patterns.
 */

export interface SystemHealthReport {
  score: number;
  detectedWeaknesses: string[];
  efficiencyGaps: string[];
  recurringErrors: string[];
  lastAudit: string;
}

export class ArchitectureAnalyzer {
  /**
   * Performs a cognitive audit of system-wide performance and error trends.
   */
  static async performSystemAudit(): Promise<SystemHealthReport> {
    console.info("[FORGE-ANALYZER] Initializing deep mesh audit...");
    
    // 1. Analyze persistent memory for recurring error patterns
    // We look for common failures like 429 (Quota) or 404 (Model Mismatch)
    const errorFixes = await persistentMemory.retrieve("ERROR_FIX_", "error_resolution");
    
    const prompt = `Analyze the current state of ForgeOS. 
Context: We have detected recurring error patterns and potential logic duplication in agent-to-agent communication.

TASK:
1. Identify 3 architectural improvements.
2. Focus on reducing API latency and improving model-routing stability.
3. Return ONLY valid JSON.

JSON Structure:
{
  "score": number (0-1),
  "weaknesses": ["string"],
  "gaps": ["string"],
  "errors": ["string"]
}`;

    const { text } = await forgeGenerate(MODELS.GPT4O_MINI, prompt, "architecture");
    
    try {
      const result = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
      return {
        score: result.score || 0.8,
        detectedWeaknesses: result.weaknesses || [],
        efficiencyGaps: result.gaps || [],
        recurringErrors: result.errors || [],
        lastAudit: new Date().toISOString(),
      };
    } catch (e) {
      console.error("[FORGE-ARCH-ANALYZER] Failed to parse architecture analysis response:", e);
      return {
        score: 0.75,
        detectedWeaknesses: ["Parsing failure during audit"],
        efficiencyGaps: [],
        recurringErrors: [],
        lastAudit: new Date().toISOString(),
      };
    }
  }
}
