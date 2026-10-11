/**
 * @fileOverview ForgeOS Safety Governor (Production v15 - Concurrency Optimized)
 * Strictly blocks experimental models and prevents retry storms.
 * Adjusted for parallel mesh architecture.
 */

export interface SafetyCheck {
  isSafe: boolean;
  riskScore: number;
  reason?: string;
}

export class SafetyGovernor {
  private static recentActions: number = 0;
  private static lastActionTime: number = Date.now();

  /**
   * Assesses if an AI action is safe to proceed.
   * Implements anti-recursion and cost-impact thresholds.
   * Optimized for parallel mesh bursts.
   */
  static assessAction(actionType: string, costImpact: number): SafetyCheck {
    const now = Date.now();
    const timeDelta = now - this.lastActionTime;
    
    // Anti-Recursion Logic: Limit actions within high-frequency bursts
    // We allow for larger bursts to support parallel agent execution
    if (timeDelta < 1000) {
      this.recentActions++;
    } else {
      // Rapidly decay action count when idle to clear the throttle
      const decay = Math.max(1, Math.floor(timeDelta / 200));
      this.recentActions = Math.max(0, this.recentActions - decay);
      
      // Full reset if idle for more than 3 seconds
      if (timeDelta > 3000) this.recentActions = 0;
    }
    this.lastActionTime = now;

    // Threshold increased from 5 to 25 to support parallel bursts 
    // (Multiple specialized agents + orchestration overhead)
    if (this.recentActions > 25) {
      return { 
        isSafe: false, 
        riskScore: 1.0, 
        reason: "SYSTEM_THROTTLED: Anti-recursion protection active. High-concurrency mesh cooling down." 
      };
    }

    if (costImpact > 1.00) {
      return { 
        isSafe: false, 
        riskScore: 0.9, 
        reason: "BUDGET_PROTECTION: Action cost exceeds single-chain limit." 
      };
    }

    return { isSafe: true, riskScore: 0.1 };
  }

  /**
   * Block unstable/preview models to prevent tool-calling thought_signature errors.
   */
  static validateModelSwitch(targetModel: string): boolean {
    const forbidden = ["preview", "experimental", "gemini-3", "thinking", "alpha", "beta"];
    return !forbidden.some(f => targetModel.toLowerCase().includes(f));
  }
}
