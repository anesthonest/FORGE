import { ecosystemMonitor, HealthStatus } from "../core/ecosystem-monitor";
import { resourceManager } from "./resource-manager";

/**
 * @fileOverview ForgeOS Platform Health Dashboard
 * Monitors multi-project health signals and manages global emergency states.
 */

export type PlatformState = 'NORMAL' | 'LOAD_CONTROL' | 'PROTECTED' | 'PLATFORM_SAFE_MODE';

export interface PlatformTelemetry {
  globalState: PlatformState;
  activeProjects: number;
  totalSpend: number;
  meshErrorRate: number;
  systemStatus: HealthStatus;
}

export class PlatformHealth {
  /**
   * Synthesizes all cloud signals into a unified platform telemetry report.
   */
  static getPlatformStatus(): PlatformTelemetry {
    const metrics = ecosystemMonitor.getMetrics();
    const usage = resourceManager.getUsageStats();
    const totalSpend = usage.reduce((acc, curr) => acc + curr.totalSpendUsd, 0);
    
    let globalState: PlatformState = 'NORMAL';

    if (totalSpend > 45) globalState = 'PLATFORM_SAFE_MODE';
    else if (metrics.errorRate > 0.3) globalState = 'PROTECTED';
    else if (totalSpend > 30) globalState = 'LOAD_CONTROL';

    return {
      globalState,
      activeProjects: usage.length,
      totalSpend,
      meshErrorRate: metrics.errorRate,
      systemStatus: ecosystemMonitor.getStatus()
    };
  }

  /**
   * Forces a global emergency state transition.
   */
  static emergencyShift(targetState: PlatformState) {
    console.warn(`[FORGE-HEALTH] Global Emergency Shift Triggered: -> ${targetState}`);
    // This state can be used by the GlobalRouter to block expensive tiers
  }
}
