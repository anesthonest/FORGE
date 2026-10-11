/**
 * @fileOverview ForgeOS Cost Intelligence Engine
 * Predicts and analyzes token usage, compute costs, and autonomous lifecycle pricing.
 */

import { MODELS } from '@/ai/core/model-router';

export interface TokenEstimation {
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
}

/**
 * Pricing for the ForgeOS Economy Engine.
 */
export const PRICING = {
  [MODELS.GEMINI_PRO]: {
    input: 0.00125 / 1000,
    output: 0.00375 / 1000,
  },
  [MODELS.GEMINI_FLASH]: {
    input: 0.0001 / 1000,
    output: 0.0004 / 1000,
  },
  [MODELS.GPT4O]: {
    input: 0.005 / 1000,
    output: 0.015 / 1000,
  },
  [MODELS.GPT4O_MINI]: {
    input: 0.00015 / 1000,
    output: 0.0006 / 1000,
  },
};

export const LIFECYCLE_COSTS = {
  simulation: 0.05,
  deployment: 0.1,
  compute: 0.0001,
};

export class CostAnalyzer {
  static estimateTaskCost(
    input: string,
    model: string,
    complexity: 'low' | 'medium' | 'high'
  ): TokenEstimation {
    const inputTokens = Math.ceil(input.length / 4);
    const outputTokens = complexity === 'high' ? 1500 : complexity === 'medium' ? 800 : 300;
    
    const modelPricing = (PRICING as Record<string, { input: number; output: number }>)[model] || PRICING[MODELS.GEMINI_FLASH];
    
    const estimatedCostUsd = (inputTokens * modelPricing.input) + (outputTokens * modelPricing.output);
    
    return {
      inputTokens,
      outputTokens,
      estimatedCostUsd,
    };
  }

  static estimateLifecycleCost(baseTaskCost: number, includeSimulation = true, includeDeployment = true): number {
    let total = baseTaskCost;
    if (includeSimulation) total += LIFECYCLE_COSTS.simulation;
    if (includeDeployment) total += LIFECYCLE_COSTS.deployment;
    return total;
  }

  static getOptimizationSuggestion(estimatedCost: number): string {
    if (estimatedCost > 0.05) {
      return "CONSIDER: Splitting task into sub-workflows to use FLASH for non-critical steps.";
    }
    return "PATH OPTIMIZED: Current routing is cost-efficient.";
  }
}
