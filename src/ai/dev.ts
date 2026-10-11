import { config } from 'dotenv';
config();

/**
 * @fileOverview Forge Execution Kernel - Intelligence Registry
 * Manages module resolution and lazy imports for the swarm.
 */

// Core Infrastructure
import '@/ai/core/forge-config';
import '@/ai/core/model-registry';
import '@/ai/core/rate-limit-guard';
import '@/ai/core/response-cache';
import '@/ai/core/persistent-memory';
import '@/ai/core/model-router';
import '@/ai/core/self-healing-engine';

// Recovery & Observability
import '@/ai/core/ecosystem-monitor';
import '@/ai/core/safety-governor';
import '@/ai/core/autonomous-recovery';
import '@/ai/core/performance-optimizer';

// Swarm Logic
import '@/ai/core/agent-watchdog';
import '@/ai/core/swarm-aggregator';
import '@/ai/core/swarm-result-normalizer';
import '@/ai/core/metadata-normalizer';
import '@/ai/core/response-normalizer';
import '@/ai/core/response-formatter';
import '@/ai/core/response-synthesizer';

// Entry Points (Lazy Registration)
export const intelligenceKernel = {
  orchestrate: async (goal: string) => {
    const { swarmOrchestrator } = await import('@/ai/core/swarm-orchestrator');
    return swarmOrchestrator(goal);
  },
  chat: async (query: string) => {
    const { chatResponseFlow } = await import('@/ai/flows/chat-response-flow');
    return chatResponseFlow(query);
  },
  core: async (command: string, tier: any, role: string) => {
    const { coreIntelligence } = await import('@/ai/core/core-intelligence');
    return coreIntelligence(command, tier, role);
  }
};
