'use server';

/**
 * @fileOverview Forge OS Core Intelligence Engine (Economic Unified v85)
 * Integrated with Enterprise Hierarchy and Priority Routing.
 */

import { SaaSGuard } from "./saas-guard";
import { swarmOrchestrator } from "./swarm-orchestrator";
import { orchestrationBrain } from "../agents/orchestrator-agent";
import { RequestClassifier } from "./request-classifier";
import { MetadataNormalizer } from "./metadata-normalizer";
import { recordUsage } from "./usage-recorder";
import { getForgeModel, forgeGenerate } from "./model-router";
import { logForgeEvent } from "./event-logger";
import { BillingEngine, SubscriptionTier, FORGE_PLANS } from "@/lib/billing-engine";
import { getServerFirebase } from "@/lib/firebase/server";

/**
 * Unified Core Intelligence Kernel with Enterprise Hierarchy Enforcement
 */
export async function coreIntelligence(
  command: string, 
  userTier: SubscriptionTier = 'free',
  userRole: string = 'user',
  userId?: string
): Promise<any> {
  const startTime = Date.now();
  const { db } = getServerFirebase();

  try {
    // 1. INPUT LAYER & INTENT CLASSIFICATION
    const intelLevel = RequestClassifier.classify(command);
    const operation = RequestClassifier.mapToExactIntent(intelLevel, command);
    const tier = RequestClassifier.determineTier(intelLevel, command);
    
    const planLimits = FORGE_PLANS[userTier];

    // 2. SETTLEMENT & SECURITY GUARD (Plan Gating)
    let walletData = { cvuCredits: 100 };
    if (userId && db) {
      const userSnap = await db.collection('users').doc(userId).get();
      if (userSnap.exists) {
        walletData = userSnap.data()?.wallet || walletData;
      }
    }

    const auth = SaaSGuard.validateAccess(userTier, intelLevel, walletData, userRole);
    if (!auth.allowed) {
      return MetadataNormalizer.normalize(auth.blocked_payload);
    }

    let result;

    // 3. PLANNING & EXECUTION (Tier-based priority routing)
    if (tier === 'TIER_1') {
      const model = getForgeModel('fast');
      const response = await forgeGenerate(model, command, 'fast');
      result = { 
        summary: response.text, 
        operation, 
        intent: "instant_response", 
        quality_score: 1.0, 
        selected_model: model,
        priority: planLimits.priority
      };
      
      if (userId) {
        const tokens = (command.length + response.text.length) / 4;
        await recordUsage(userId, { tokens }, 'instant_response');
      }

    } else {
      const planningResult = await orchestrationBrain(command);
      
      // Inject Plan Priority into Orchestration
      console.info(`[FORGE-CORE] Routing through lane: ${planLimits.priority.toUpperCase()}`);
      
      const executionResult = await swarmOrchestrator(command, planningResult.tool_calls, planningResult.execution_mode);
      
      result = {
        ...executionResult,
        intent: operation,
        operation,
        execution_tier: tier,
        mesh_priority: planLimits.priority
      };

      if (userId) {
        const tokens = (command.length + (result.summary?.length || 0)) / 4;
        await recordUsage(userId, { 
          workflows: 1, 
          agents: planningResult.tool_calls.length,
          tokens
        }, operation);
      }
    }

    // 4. PERSISTENT EVENT RECORDING (PLAN TRACKING)
    if (userId) {
      const qualityScore = result.quality_score || 0.85;
      const estimatedValue = BillingEngine.estimateValueOutcome(operation, qualityScore);

      logForgeEvent({
        type: 'ai_execution',
        userId,
        source: 'CoreIntelligence',
        action: operation,
        metadata: {
          intelLevel,
          tier,
          userTier,
          priority: planLimits.priority,
          duration: Date.now() - startTime,
          outcome_value_usd: estimatedValue
        },
        valueImpact: estimatedValue,
        contributionScore: qualityScore * 100
      });
    }

    return MetadataNormalizer.normalize(result);

  } catch (error: any) {
    console.error("[FORGE-CORE-FATAL]", error);
    
    if (userId) {
      logForgeEvent({
        type: 'system_audit_event',
        userId,
        source: 'CoreIntelligence_Fault',
        action: 'EXECUTION_INTERRUPT',
        metadata: { error: error.message, tier: userTier },
        valueImpact: -1.0, 
        resourceUsage: 50 
      });
    }

    return {
      status: "failed",
      error: { message: error.message || "Execution Interrupt.", code: "CORE_FAULT" }
    };
  }
}
