'use server';

/**
 * @fileOverview Forge OS Core Engine Orchestration Flow
 * Hardened for Unified Core Stability: Mandatory serializable envelope.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { coreIntelligence } from '../core/core-intelligence';

const OrchestrateSwarmInputSchema = z.object({
  developmentGoal: z.string(),
  memoryContext: z.string().optional(),
  userTier: z.enum(['free', 'pro', 'power', 'enterprise']).default('free'),
  userRole: z.string().optional().default('user'),
});
export type OrchestrateSwarmInput = z.infer<typeof OrchestrateSwarmInputSchema>;

/**
 * Executes a development task and returns the mandatory stability JSON structure.
 */
export async function orchestrateDevelopmentTask(input: OrchestrateSwarmInput): Promise<any> {
  try {
    // Invoke the Unified Core Intelligence Kernel
    const result = await coreIntelligence(
      input.developmentGoal || "", 
      input.userTier as any, 
      input.userRole
    );

    // DEEP SANITIZATION: Eliminate all non-serializable artifacts
    const sanitizedData = JSON.parse(JSON.stringify(result));

    // Return mandatory VINEXSAH Stability Wrapper
    return {
      success: true,
      status: "completed",
      data: sanitizedData,
      error: null
    };

  } catch (error: any) {
    console.error("[FORGE-FLOW-FATAL] Unified Execution Failed:", error.message);
    return {
      success: false,
      status: "failed",
      data: null,
      error: {
        message: error.message || "Autonomous cycle interrupted.",
        code: "FLOW_RECOVERY_TRIGGERED"
      }
    };
  }
}
