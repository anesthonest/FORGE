import { resourceManager } from "./resource-manager";

/**
 * @fileOverview ForgeOS Global Cost Governor
 * Enforces platform-wide safety rules and spend caps.
 */

export interface PlatformAudit {
  approved: boolean;
  reason?: string;
  emergencyState?: string;
}

class GlobalCostGovernor {
  private static instance: GlobalCostGovernor;
  private PLATFORM_BUDGET_CAP = 50.00; // Hard cap for total studio session spend

  private constructor() {}

  static getInstance(): GlobalCostGovernor {
    if (!GlobalCostGovernor.instance) {
      GlobalCostGovernor.instance = new GlobalCostGovernor();
    }
    return GlobalCostGovernor.instance;
  }

  /**
   * Audits a cross-project action against global budget and stability rules.
   */
  auditPlatformAction(estimatedCost: number): PlatformAudit {
    const totalSpend = resourceManager.getUsageStats().reduce((acc, curr) => acc + curr.totalSpendUsd, 0);

    // 1. Hard Budget Limit
    if (totalSpend + estimatedCost > this.PLATFORM_BUDGET_CAP) {
      return { 
        approved: false, 
        reason: "PLATFORM_BUDGET_EXCEEDED: Global spending cap reached for this session.",
        emergencyState: "PLATFORM_SAFE_MODE"
      };
    }

    // 2. Load Control Check
    if (totalSpend > this.PLATFORM_BUDGET_CAP * 0.7) {
      console.warn("[FORGE-GOVERNOR] Platform entering LOAD_CONTROL mode (70% budget reached).");
      return { approved: true, emergencyState: "LOAD_CONTROL" };
    }

    return { approved: true };
  }
}

export const globalCostGovernor = GlobalCostGovernor.getInstance();
