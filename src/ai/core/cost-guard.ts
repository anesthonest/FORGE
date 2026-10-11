import { FORGE_CONFIG, updateSpend } from "./forge-config";
import { MODELS } from "./model-registry";

/**
 * @fileOverview ForgeOS Production Cost Guard (v25)
 * Prevents quota exhaustion and enforces session budget caps with high-precision metering.
 */

export class CostGuard {
  private static rates: Record<string, { input: number; output: number }> = {
    [MODELS.GPT4O]: { input: 0.005 / 1000, output: 0.015 / 1000 },
    [MODELS.GPT4O_MINI]: { input: 0.00015 / 1000, output: 0.0006 / 1000 },
    [MODELS.GEMINI_PRO]: { input: 0.00125 / 1000, output: 0.00375 / 1000 },
    [MODELS.GEMINI_FLASH]: { input: 0.0001 / 1000, output: 0.0004 / 1000 },
  };

  /**
   * Validates if the current action fits within the hard session budget.
   */
  static checkBudget(model: string, prompt: string): { allowed: boolean; reason?: string } {
    if (FORGE_CONFIG.TOTAL_SPEND_USD >= FORGE_CONFIG.BUDGET_CAP_USD) {
      return { allowed: false, reason: "PLATFORM_LOCKDOWN: Session budget cap reached." };
    }

    const estimatedCost = this.estimateCost(model, prompt);
    if (FORGE_CONFIG.TOTAL_SPEND_USD + estimatedCost > FORGE_CONFIG.BUDGET_CAP_USD) {
      return { allowed: false, reason: "BUDGET_RISK: Action exceeds remaining session liquidity." };
    }

    return { allowed: true };
  }

  /**
   * Estimates the cost based on prompt length and specific model token rates.
   */
  static estimateCost(model: string, prompt: string): number {
    const rate = this.rates[model] || this.rates[MODELS.GEMINI_FLASH];
    const inputTokens = prompt.length / 4;
    const estimatedOutput = 800; // Typical engineering task output
    return (inputTokens * rate.input) + (estimatedOutput * rate.output);
  }

  /**
   * Updates the global spend tracker with actual execution cost.
   */
  static recordExecution(model: string, prompt: string, output: string) {
    const inputTokens = prompt.length / 4;
    const outputTokens = output.length / 4;
    const rate = this.rates[model] || this.rates[MODELS.GEMINI_FLASH];
    
    const actualCost = (inputTokens * rate.input) + (outputTokens * rate.output);
    updateSpend(actualCost);
    
    console.info(`[FORGE-COST] Task Finalized | Cost: $${actualCost.toFixed(6)} | Session: $${FORGE_CONFIG.TOTAL_SPEND_USD.toFixed(4)}`);
  }
}
