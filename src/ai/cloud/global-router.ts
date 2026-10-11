
import { responseCache } from "../core/response-cache";
import { persistentMemory } from "../core/persistent-memory";
import { forgeGenerate, getForgeModel } from "../core/model-router";
import { resourceManager } from "./resource-manager";
import { CostGuard } from "../core/cost-guard";
import { GeoRouter, RegionId } from "@/lib/geo-router";

/**
 * @fileOverview ForgeOS Global Intelligence Router (Distributed v2)
 * Enforces the strict multi-tier fallback hierarchy across the global mesh.
 * Engineered for Hyperscale: Stateless, Region-Aware, and Load-Balanced.
 */

export class GlobalRouter {
  /**
   * Routes a prompt through the optimized platform-wide hierarchy:
   * 1. Cache -> 2. Memory -> 3. Regional Inference -> 4. Failover Mesh
   */
  static async route(
    projectId: string, 
    prompt: string, 
    taskType: string = 'generation', 
    userRegion: string = 'US-01'
  ) {
    const model = getForgeModel(taskType);
    
    // 1. Resolve Optimal Region (Hyperscale Affinity)
    const targetRegion = GeoRouter.getOptimalRouting(userRegion);
    
    // 2. Quota & Residency Pre-Check
    const estCost = CostGuard.estimateCost(model, prompt);
    const quotaAudit = resourceManager.checkQuota(projectId, estCost);
    
    if (!quotaAudit.allowed) {
      throw new Error(quotaAudit.reason);
    }

    // 3. TIER 1: SESSION CACHE (Edge Performance)
    const cached = responseCache.get(model, prompt);
    if (cached) {
      console.info(`[FORGE-GLOBAL] Edge Cache Hit: ${targetRegion}`);
      return { text: cached.text, tier: 'CACHE', region: targetRegion };
    }

    // 4. TIER 2: PERSISTENT GLOBAL MEMORY (Pattern Reuse)
    const memory = await persistentMemory.retrieve(prompt, taskType);
    if (memory) {
      return { text: String(memory.output), tier: 'MEMORY', region: 'GLOBAL' };
    }

    // 5. TIER 3: REGIONAL AI INFERENCE (Distributed Execution)
    console.info(`[FORGE-GLOBAL] Dispatching inference to region node: ${targetRegion}`);
    
    try {
      const result = await forgeGenerate(model, prompt, taskType);
      
      // 6. Post-Execution: Async Record Cost & Commit to Memory
      const actualCost = CostGuard.estimateCost(model, prompt + result.text);
      resourceManager.recordConsumption(projectId, actualCost);

      return { ...result, tier: 'LIVE_AI', region: targetRegion };
    } catch (error) {
      // 7. FAILOVER: Reroute to Global Scale Node
      console.warn(`[FORGE-GLOBAL] Regional node ${targetRegion} failure. Failing over to US-01.`);
      const failoverResult = await forgeGenerate(model, prompt, taskType);
      return { ...failoverResult, tier: 'FAILOVER_AI', region: 'US-01' };
    }
  }
}
