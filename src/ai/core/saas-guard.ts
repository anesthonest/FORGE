/**
 * @fileOverview ForgeOS SaaS Entitlement Guard (Zero-Trust v20)
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 * 
 * Enforces strict License Gating, Subscription Status verification, and 
 * Dynamic Load Throttling for Industrial Stability.
 */

import { RequestIntelligenceLevel } from "./request-classifier";
import { BillingEngine, SubscriptionTier, FORGE_PLANS } from "@/lib/billing-engine";
import { healthMonitor } from "@/lib/orchestrator/health-monitor";

export type { SubscriptionTier };

export interface AccessResult {
  allowed: boolean;
  reason?: string;
  blocked_payload?: any;
}

export class SaaSGuard {
  /**
   * Validates if the operator's license and system load permit execution.
   * Performs real-time server-side entitlement check.
   */
  static validateAccess(
    tier: SubscriptionTier = 'free', 
    level: RequestIntelligenceLevel, 
    walletData: any = {},
    role: string = 'user',
    subscriptionStatus: string = 'inactive'
  ): AccessResult {
    // 1. Sovereign Authority Overrides (Admin/Operator)
    if (role === 'admin' || role === 'operator') return { allowed: true };

    // 2. DYNAMIC LOAD THROTTLING (Stability First)
    const vitals = healthMonitor.getVitals();
    if (vitals.state === 'OVERLOAD' && tier === 'free') {
      return this.getBlockedPayload(tier, "SYSTEM_OVERLOAD", "Fabric congestion peak. Non-industrial execution is throttled to preserve mesh integrity.");
    }

    // 3. ZERO-TRUST STATUS GATING (Mandatory Active Check)
    if (subscriptionStatus !== 'active' && tier !== 'free') {
      return this.getBlockedPayload(tier, "SUBSCRIPTION_INACTIVE", "Industrial license suspended. Resolve pending settlements in the economy hub to resume fabrication.");
    }

    // 4. CAPABILITY GATING (Feature Paywall)
    const limits = FORGE_PLANS[tier];
    if (!limits) return { allowed: false, reason: "UNRECOGNIZED_LICENSE_TIER" };

    if ((level === 'AUTONOMOUS' || level === 'AUTOPILOT') && !limits.isAutonomousEnabled) {
      return this.getBlockedPayload(tier, "AUTONOMOUS_CAPABILITY_LOCKED", "Elite-tier license required for autonomous swarm orchestration.");
    }

    // 5. RESOURCE GATING (CVU Liquidity)
    const quota = BillingEngine.checkQuota(tier, walletData, subscriptionStatus as any);
    if (!quota.allowed) {
      return this.getBlockedPayload(tier, quota.reason || "COMPUTE_LIMIT_EXCEEDED", "Insufficient Compute Value Units (CVU). Fund your sovereign wallet to continue reasoning.");
    }

    // 6. RATE LIMITING PROTECTION (Abuse Detection)
    // In production, this would integrate with a Redis-backed rate limiter
    
    return { allowed: true };
  }

  private static getBlockedPayload(tier: SubscriptionTier, reasonCode: string, message: string): AccessResult {
    return { 
      allowed: false, 
      reason: reasonCode,
      blocked_payload: {
        status: "blocked",
        reason: reasonCode,
        upgrade_required: true,
        current_tier: tier,
        message: message,
        timestamp: new Date().toISOString()
      }
    };
  }
}