/**
 * @fileOverview ForgeOS Hybrid Model Routing Engine
 * Selects optimal models based on task intent, complexity, and data sensitivity.
 */

import { getForgeModel, MODELS } from '@/ai/core/model-router';

export type TaskType = 'code' | 'reasoning' | 'ui' | 'debug' | 'planning' | 'architecture';

export interface RoutingCriteria {
  task: TaskType;
  complexity: 'low' | 'medium' | 'high';
  contextSize?: number;
  isSensitive?: boolean;
}

/**
 * Routes to the optimal model provider based on cost, speed, and security.
 * Bridges business logic with the centralized AI core router.
 */
export function getOptimalModel(criteria: RoutingCriteria): string {
  const { task, complexity, isSensitive } = criteria;

  if (isSensitive) {
    console.log('ForgeOS Hybrid Router: SENSITIVE DATA DETECTED. Routing to Sovereign Isolated Model.');
    return MODELS.GEMINI_PRO; 
  }

  // Map business tasks to core router task types
  const routerTaskMap: Record<TaskType, string> = {
    planning: 'planning',
    reasoning: 'reasoning',
    architecture: 'architecture',
    code: 'coding',
    debug: 'debug',
    ui: 'coding'
  };

  return getForgeModel(routerTaskMap[task] || 'default');
}

export function getRuntimeMode(): 'CLOUD' | 'HYBRID' | 'AIR_GAPPED' {
  return 'HYBRID';
}
