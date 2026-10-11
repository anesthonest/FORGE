/**
 * @fileOverview ForgeOS Production Billing & Economy Engine
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 * 
 * Manages Compute Value Units (CVU), Production Plan Gating, and Profit Intelligence.
 * Updated for Full Enterprise Hierarchy v2.0 and Billing Identity linking.
 */

export type SubscriptionTier = 
  | 'free' 
  | 'pro' 
  | 'premium' 
  | 'elite' 
  | 'ent_pro' 
  | 'ent_premium' 
  | 'ent_elite';

export type SubscriptionStatus = 'active' | 'inactive' | 'past_due' | 'cancelled';

export type MeshPriority = 'low' | 'normal' | 'high' | 'realtime' | 'dedicated';

export interface PlanLimits {
  name: string;
  priceMonthly: number;
  dailyAIQuota: number;
  maxEvents: number;
  priority: MeshPriority;
  isAutonomousEnabled: boolean;
  hasAPI: boolean;
  cvuMultiplier: number;
  historyDays: number;
}

export const FORGE_PLANS: Record<SubscriptionTier, PlanLimits> = {
  free: {
    name: "Sovereign Free",
    priceMonthly: 0,
    dailyAIQuota: 10,
    maxEvents: 50,
    priority: 'low',
    isAutonomousEnabled: false,
    hasAPI: false,
    cvuMultiplier: 1.5,
    historyDays: 7
  },
  pro: {
    name: "Engineering Pro",
    priceMonthly: 49,
    dailyAIQuota: 100,
    maxEvents: 5000,
    priority: 'normal',
    isAutonomousEnabled: false,
    hasAPI: false,
    cvuMultiplier: 1.2,
    historyDays: 90
  },
  premium: {
    name: "Factory Premium",
    priceMonthly: 149,
    dailyAIQuota: 1000,
    maxEvents: 100000,
    priority: 'high',
    isAutonomousEnabled: true,
    hasAPI: false,
    cvuMultiplier: 1.0,
    historyDays: 365
  },
  elite: {
    name: "Elite Architect",
    priceMonthly: 499,
    dailyAIQuota: 5000,
    maxEvents: 1000000,
    priority: 'realtime',
    isAutonomousEnabled: true,
    hasAPI: true,
    cvuMultiplier: 0.9,
    historyDays: -1 // Unlimited
  },
  ent_pro: {
    name: "Enterprise Pro",
    priceMonthly: 999,
    dailyAIQuota: 10000,
    maxEvents: 5000000,
    priority: 'high',
    isAutonomousEnabled: true,
    hasAPI: true,
    cvuMultiplier: 0.85,
    historyDays: -1
  },
  ent_premium: {
    name: "Enterprise Premium",
    priceMonthly: 2499,
    dailyAIQuota: 50000,
    maxEvents: 25000000,
    priority: 'realtime',
    isAutonomousEnabled: true,
    hasAPI: true,
    cvuMultiplier: 0.8,
    historyDays: -1
  },
  ent_elite: {
    name: "Enterprise Elite",
    priceMonthly: 4999,
    dailyAIQuota: 1000000, // Fair use
    maxEvents: -1,
    priority: 'dedicated',
    isAutonomousEnabled: true,
    hasAPI: true,
    cvuMultiplier: 0.7,
    historyDays: -1
  }
};

export const CVU_WEIGHTS = {
  AI_TOKEN: 1,
  WORKFLOW: 50,
  AGENT: 100,
  HEARTBEAT: 1,
  DEPLOYMENT: 500
};

export class BillingEngine {
  /**
   * Generates a unique, immutable billing identity for a user.
   */
  static generateBillingId(uid: string): string {
    return `bill_${Buffer.from(uid).toString('hex').slice(0, 12)}_${Math.random().toString(36).slice(2, 6)}`;
  }

  static calculateCVU(usage: {
    tokens?: number;
    workflows?: number;
    agents?: number;
    deployments?: number;
  }): number {
    return (
      (usage.tokens || 0) * CVU_WEIGHTS.AI_TOKEN +
      (usage.workflows || 0) * CVU_WEIGHTS.WORKFLOW +
      (usage.agents || 0) * CVU_WEIGHTS.AGENT +
      (usage.deployments || 0) * CVU_WEIGHTS.DEPLOYMENT
    );
  }

  static calculateUSD(cvu: number, tier: SubscriptionTier = 'free'): number {
    const ratePerCVU = 0.0001; 
    const multiplier = FORGE_PLANS[tier]?.cvuMultiplier || 1.0;
    return cvu * ratePerCVU * multiplier;
  }

  static checkQuota(tier: SubscriptionTier, walletData: any, subscriptionStatus: SubscriptionStatus = 'inactive'): { allowed: boolean; reason?: string } {
    if (subscriptionStatus !== 'active' && tier !== 'free') {
      return { allowed: false, reason: "SUBSCRIPTION_INACTIVE" };
    }

    const limits = FORGE_PLANS[tier];
    if (!limits) return { allowed: false, reason: "INVALID_LICENSE_TIER" };

    const cvuCredits = walletData?.cvuCredits || 0;
    if (cvuCredits < 10) {
      return { allowed: false, reason: "INSUFFICIENT_COMPUTE_LIQUIDITY" };
    }

    return { allowed: true };
  }

  static estimateValueOutcome(operation: string, qualityScore: number): number {
    const valueMap: Record<string, number> = {
      'ai_task': 0.5,
      'workflow_execution': 5.0,
      'autonomous_operation': 25.0,
      'ui_generation': 5.0,
      'system_operation': 10.0,
      'deployment_operation': 15.0
    };
    return (valueMap[operation] || 1.0) * qualityScore;
  }
}