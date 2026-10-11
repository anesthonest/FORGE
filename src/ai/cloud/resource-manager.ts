import { projectOrchestrator } from "./project-orchestrator";

/**
 * @fileOverview ForgeOS Cloud Resource Manager
 * Distributes AI resources across projects and enforces granular quotas.
 */

export interface ResourceUsage {
  projectId: string;
  totalSpendUsd: number;
  lastActive: string;
  requestCount: number;
}

class ResourceManager {
  private static instance: ResourceManager;
  private usage: Map<string, ResourceUsage> = new Map();

  private constructor() {}

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  /**
   * Validates if a project has sufficient remaining quota for an AI action.
   */
  checkQuota(projectId: string, estimatedCost: number): { allowed: boolean; reason?: string } {
    const config = projectOrchestrator.getProject(projectId);
    if (!config) return { allowed: false, reason: "Project context missing." };

    const currentUsage = this.usage.get(projectId) || { projectId, totalSpendUsd: 0, lastActive: '', requestCount: 0 };
    
    if (currentUsage.totalSpendUsd + estimatedCost > config.quotaLimitUsd) {
      return { allowed: false, reason: `QUOTA_EXCEEDED: Project ${projectId} reached its $${config.quotaLimitUsd} limit.` };
    }

    return { allowed: true };
  }

  /**
   * Records resource consumption after a successful AI execution.
   */
  recordConsumption(projectId: string, cost: number) {
    const current = this.usage.get(projectId) || { 
      projectId, 
      totalSpendUsd: 0, 
      lastActive: new Date().toISOString(), 
      requestCount: 0 
    };

    this.usage.set(projectId, {
      ...current,
      totalSpendUsd: current.totalSpendUsd + cost,
      lastActive: new Date().toISOString(),
      requestCount: current.requestCount + 1
    });

    console.info(`[FORGE-RESOURCES] Project ${projectId} spend: $${this.usage.get(projectId)!.totalSpendUsd.toFixed(6)}`);
  }

  getUsageStats(): ResourceUsage[] {
    return Array.from(this.usage.values());
  }
}

export const resourceManager = ResourceManager.getInstance();
