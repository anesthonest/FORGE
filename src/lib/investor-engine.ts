/**
 * @fileOverview Forge OS Investor Intelligence Kernel
 * Implements industrial math for SaaS valuation, LTV/CAC, and Growth velocity.
 * PROPERTY OF VINEXSAH TECHNOLOGIES.
 */

export interface InvestorMetrics {
  mrr: number;
  arr: number;
  churnRate: number;
  growthRate: number;
  cac: number;
  ltv: number;
  ltvCacRatio: number;
  burnRate: number;
  runwayMonths: number;
  valuation: number;
  healthScore: number;
  profitMargin: number;
}

export class InvestorEngine {
  /**
   * Computes an estimated valuation based on SaaS growth multipliers.
   * Logic: ARR * Multiplier (adjusted for growth and churn).
   */
  static calculateValuation(arr: number, growthRate: number, churnRate: number): number {
    let multiplier = 10; // Baseline SaaS multiplier

    // Growth Boost
    if (growthRate > 0.5) multiplier += 20;
    else if (growthRate > 0.2) multiplier += 10;

    // Churn Penalty
    if (churnRate > 0.1) multiplier -= 5;
    else if (churnRate < 0.03) multiplier += 5;

    return arr * Math.max(multiplier, 5);
  }

  /**
   * Computes the SaaS Health Score (0-100).
   */
  static computeHealthScore(metrics: Partial<InvestorMetrics>): number {
    let score = 50; // Neutral starting point

    if ((metrics.growthRate || 0) > 0.2) score += 15;
    if ((metrics.ltvCacRatio || 0) > 3) score += 15;
    if ((metrics.churnRate || 0) < 0.05) score += 10;
    if ((metrics.profitMargin || 0) > 0.2) score += 10;

    // Reductions
    if ((metrics.burnRate || 0) > (metrics.mrr || 0)) score -= 15;
    if ((metrics.churnRate || 0) > 0.15) score -= 20;

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Estimates Customer Acquisition Cost (CAC) and Lifetime Value (LTV).
   */
  static computeUnitEconomics(totalMarketing: number, newUsers: number, arpu: number, churnRate: number) {
    const cac = newUsers > 0 ? totalMarketing / newUsers : 50; // Default estimate
    const ltv = arpu / Math.max(churnRate, 0.01);
    return { cac, ltv, ratio: ltv / cac };
  }
}
