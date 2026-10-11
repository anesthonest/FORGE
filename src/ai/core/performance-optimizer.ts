import { ecosystemMonitor } from "./ecosystem-monitor";

/**
 * @fileOverview ForgeOS Performance Optimizer (v12 - Heuristic Driven)
 * Analyzes telemetry to suggest efficiency improvements.
 */

export class PerformanceOptimizer {
  /**
   * Scans system telemetry for optimization opportunities.
   */
  static analyzeEfficiency() {
    const metrics = ecosystemMonitor.getMetrics();
    const suggestions: string[] = [];

    // 1. Cache Efficiency Analysis
    if (metrics.cacheHitRate < 0.2) {
      suggestions.push("OPTIMIZE: Standardize task templates to increase pattern reuse.");
    }

    // 2. Latency Analysis
    if (metrics.latencyAvg > 2000) {
      suggestions.push("ROUTING: High latency detected. Prefer GEMINI_FLASH for non-strategic reasoning.");
    }

    // 3. Error Rate Thresholds
    if (metrics.errorRate > 0.05) {
      suggestions.push("RESILIENCE: Increased error rate. Verifying provider health guards.");
    }

    return {
      efficiencyScore: Math.floor(metrics.cacheHitRate * 100),
      suggestions,
      timestamp: new Date().toISOString()
    };
  }
}
