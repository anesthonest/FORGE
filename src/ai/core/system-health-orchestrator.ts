import { ecosystemMonitor } from "./ecosystem-monitor";
import { FORGE_CONFIG, setForgeMode, ForgeMode } from "./forge-config";

/**
 * @fileOverview ForgeOS System Health Orchestrator (Production v13 - Predictive)
 * Synthesizes telemetry into high-level failsafe states.
 */

export class SystemHealthOrchestrator {
  /**
   * Analyzes mesh health and enforces global operational states.
   * Predictive: Detects trends before they hit hard limits.
   */
  static auditSystemState(): ForgeMode {
    const metrics = ecosystemMonitor.getMetrics();
    const status = ecosystemMonitor.getStatus();
    
    let targetMode: ForgeMode = 'INTELLIGENT';

    // 1. Predictive Budget Checks
    if (FORGE_CONFIG.TOTAL_SPEND_USD >= FORGE_CONFIG.BUDGET_CAP_USD) {
      targetMode = 'LOCKDOWN';
    } else if (FORGE_CONFIG.TOTAL_SPEND_USD > FORGE_CONFIG.BUDGET_CAP_USD * 0.85) {
      targetMode = 'SAFE_MODE';
    }
    
    // 2. Performance-Based Transitions
    else if (status === 'CRITICAL' || metrics.errorRate > 0.4) {
      targetMode = 'SAFE_MODE';
    } 
    else if (status === 'DEGRADED' || metrics.errorRate > 0.15) {
      targetMode = 'PROTECTED';
    }
    else if (metrics.latencyAvg > 3000) {
      targetMode = 'SAFE_LOW_COST';
    }

    if (FORGE_CONFIG.MODE !== targetMode) {
      setForgeMode(targetMode);
    }

    return targetMode;
  }
}
