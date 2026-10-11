import { ai } from "../genkit";
import { openaiGenerate } from "../providers/openai-provider";
import { MODELS, isOpenAIModel } from "./model-registry";
export { MODELS, isOpenAIModel };
import { rateLimitGuard } from "./rate-limit-guard";
import { responseCache } from "./response-cache";
import { persistentMemory } from "./persistent-memory";
import { FORGE_CONFIG } from "./forge-config";
import { ecosystemMonitor } from "./ecosystem-monitor";
import { CostGuard } from "./cost-guard";
import { SafetyGovernor } from "./safety-governor";
import { ProductionGovernor } from "./production-governor";

/**
 * @fileOverview Forge Intelligence Router (Hardened v35 - Phase 4)
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 * 
 * Implements tiered intelligence, high-fidelity cost tracking, and failover transparency.
 */

export type ForgeTaskType = 'fast' | 'standard' | 'swarm' | 'coding' | 'debug' | 'architecture' | 'planning' | 'generation' | 'reasoning' | 'autonomous';

const inflightRequests = new Map<string, Promise<any>>();

export function getForgeModel(taskType?: string): string {
  const type = (taskType || 'generation') as ForgeTaskType;
  
  if (FORGE_CONFIG.MODE === 'EMERGENCY' || FORGE_CONFIG.MODE === 'SAFE_LOW_COST') {
    return MODELS.GEMINI_FLASH;
  }

  switch (type) {
    case 'fast':
      return MODELS.GEMINI_FLASH;
    
    case 'swarm':
    case 'planning':
    case 'architecture':
      if (rateLimitGuard.isAvailable('openai')) return MODELS.GPT4O;
      return MODELS.GEMINI_PRO;

    case 'coding':
    case 'debug':
      if (rateLimitGuard.isAvailable('googleai')) return MODELS.GEMINI_FLASH;
      return MODELS.GPT4O_MINI;

    default:
      return MODELS.GEMINI_FLASH;
  }
}

/**
 * Generates AI response with provider failover and high-fidelity telemetry.
 */
export async function forgeGenerate(
  model: string, 
  prompt: string, 
  taskType: string = 'generation',
  userTier: any = 'free',
  userRole: string = 'user'
): Promise<any> {
  const startTime = Date.now();

  // 1. HARDENED GOVERNANCE AUDIT
  const governance = ProductionGovernor.auditAction(taskType, model, prompt, userTier, userRole);
  if (!governance.approved) {
     throw new Error(`GOVERNANCE_DENIED: ${governance.reason}`);
  }

  // 2. SAFETY & GLOBAL COST AUDIT
  const safety = SafetyGovernor.assessAction(taskType, 0.01);
  if (!safety.isSafe) throw new Error(safety.reason);

  const budgetCheck = CostGuard.checkBudget(model, prompt);
  if (!budgetCheck.allowed) throw new Error(budgetCheck.reason);

  // 3. TIER 1: SESSION CACHE
  const cached = responseCache.get(model, prompt);
  if (cached) return { ...cached, tier: 'CACHE' };

  // 4. TIER 2: PERSISTENT MEMORY
  const memory = await persistentMemory.retrieve(prompt, taskType);
  if (memory) return { 
    text: typeof memory.output === 'string' ? memory.output : JSON.stringify(memory.output),
    tier: 'MEMORY'
  };

  // 5. DE-DUPLICATION
  const dedupKey = `${model}:${Buffer.from(prompt).toString('base64').slice(0, 100)}`;
  if (inflightRequests.has(dedupKey)) {
    return await inflightRequests.get(dedupKey);
  }

  // 6. TIER 3: LIVE INFERENCE (With Failover Transparency)
  const execution: Promise<any> = (async (): Promise<any> => {
    try {
      let result: any;
      if (isOpenAIModel(model)) {
        result = await openaiGenerate(prompt, model);
      } else {
        const response = await ai.generate({ model, prompt });
        
        // HIGH-FIDELITY COST TRACKING (Actual tokens from provider)
        const usage = response.usage;
        result = { 
          text: response.text,
          usage: usage ? {
            promptTokens: usage.inputTokens,
            completionTokens: usage.outputTokens,
            totalTokens: usage.totalTokens
          } : undefined
        };
      }

      // Success Path
      CostGuard.recordExecution(model, prompt, result.text);
      responseCache.set(model, prompt, result);
      await persistentMemory.store(prompt, result.text, model, taskType);
      
      ecosystemMonitor.updateTelemetry({ 
        latencyAvg: Date.now() - startTime, 
        errorRate: 0 
      });

      return { ...result, tier: 'LIVE_AI', provider: isOpenAIModel(model) ? 'openai' : 'googleai' };

    } catch (error: any) {
      console.warn(`[FORGE-FAILOVER] Provider failure on ${model}. Initiating automatic fallback.`);
      
      // FAILOVER TRANSPARENCY: Inform system of backup routing
      const fallback = (isOpenAIModel(model)) ? MODELS.GEMINI_PRO : MODELS.GPT4O_MINI;
      rateLimitGuard.markLimited(isOpenAIModel(model) ? 'openai' : 'googleai');

      if (model !== fallback) {
        const fallbackRes: any = await forgeGenerate(fallback, prompt, taskType, userTier, userRole);
        return {
          ...fallbackRes,
          failover: true,
          originalProvider: isOpenAIModel(model) ? 'openai' : 'googleai',
          message: "Primary AI provider temporarily unavailable. Request automatically routed through backup node."
        };
      }
      
      // Record Fatal Error
      const { getServerFirebase } = await import('@/lib/firebase/server');
      const { db } = getServerFirebase();
      if (db) {
        await db.collection('system_errors').add({
          timestamp: new Date().toISOString(),
          severity: 'CRITICAL',
          service: 'AI_GATEWAY',
          message: error.message,
          model
        });
      }
      
      throw error;
    }
  })();

  inflightRequests.set(dedupKey, execution);
  try { 
    return await execution; 
  } finally { 
    inflightRequests.delete(dedupKey); 
  }
}

export async function withAutonomousFallback<T>(
  taskType: ForgeTaskType,
  runner: (model: string) => Promise<T>
): Promise<T> {
  const model = getForgeModel(taskType);
  try {
    return await runner(model);
  } catch (err: any) {
    const fallback = (['planning', 'architecture', 'swarm'].includes(taskType)) ? MODELS.GEMINI_PRO : MODELS.GEMINI_FLASH;
    return await runner(fallback);
  }
}
