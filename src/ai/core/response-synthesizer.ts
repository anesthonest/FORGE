
/**
 * @fileOverview ForgeOS Final Response Synthesizer
 * Converts internal orchestration results and metadata into human-readable output.
 * Integrates the ResponseFormatter for production-grade UX.
 */

import { FinalOrchestrationOutput } from "./metadata-normalizer";
import { ResponseFormatter } from "./response-formatter";

export interface SynthesizedResponse {
  success: boolean;
  response: string;
  is_conversational: boolean;
  metadata: FinalOrchestrationOutput;
  upgrade_required?: boolean;
  suggested_upgrade?: string;
}

export class ResponseSynthesizer {
  /**
   * Synthesizes a user-facing response from raw orchestration data.
   */
  static synthesize(raw: FinalOrchestrationOutput & { upgradeRequired?: boolean, suggestedUpgrade?: string }, userGoal: string): SynthesizedResponse {
    const isConversational = !!raw.is_conversational;
    
    // 1. Handle Upgrade Required State
    if (raw.upgradeRequired) {
      return {
        success: true,
        response: raw.summary,
        is_conversational: true,
        metadata: raw,
        upgrade_required: true,
        suggested_upgrade: raw.suggestedUpgrade
      };
    }

    // 2. Primary Synthesis
    let baseResponse = raw.summary || "";

    // 3. Engineering Task Synthesis
    if (!isConversational) {
      if (raw.quality_score < 0.4) {
        baseResponse = `I encountered some instability during final audit, but I have successfully generated a best-effort implementation: \n\n${raw.summary}`;
      } else if (raw.plan && raw.plan.length > 0) {
        baseResponse = `I have successfully orchestrated an autonomous plan for your goal: "${userGoal}". I've broken this down into ${raw.plan.length} engineering steps.`;
      }
    }

    // 4. Production Formatting (The Natural Language Filter)
    const finalResponse = ResponseFormatter.toNaturalLanguage(baseResponse, userGoal);

    return {
      success: true,
      response: finalResponse,
      is_conversational: isConversational,
      metadata: raw
    };
  }
}
