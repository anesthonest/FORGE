/**
 * @fileOverview ForgeOS Ecosystem Monitor (Production v12)
 * Tracks global mesh health signals and manages system-wide operational states.
 * Updated for Phase 3: Standardized Health States.
 */

export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'WARNING' | 'CRITICAL';

export interface HealthMetrics {
  errorRate: number;
  latencyAvg: number;
  cacheHitRate: number;
  dbPressure: number;
  providerAvailability: Record<string, boolean>;
}

class EcosystemMonitor {
  private static instance: EcosystemMonitor;
  private currentStatus: HealthStatus = 'HEALTHY';
  private metrics: HealthMetrics = {
    errorRate: 0,
    latencyAvg: 0,
    cacheHitRate: 0,
    dbPressure: 0,
    providerAvailability: { openai: true, googleai: true }
  };

  private constructor() {}

  static getInstance(): EcosystemMonitor {
    if (!EcosystemMonitor.instance) {
      EcosystemMonitor.instance = new EcosystemMonitor();
    }
    return EcosystemMonitor.instance;
  }

  /**
   * Updates metrics and recalculates health status using Phase 3 thresholds.
   */
  updateTelemetry(update: Partial<HealthMetrics>) {
    this.metrics = { ...this.metrics, ...update };
    this.evaluateStatus();
  }

  private evaluateStatus() {
    const { errorRate, latencyAvg, dbPressure, providerAvailability } = this.metrics;
    
    // CRITICAL: Major providers down OR extreme error rates
    if (errorRate > 0.4 || (!providerAvailability.openai && !providerAvailability.googleai) || dbPressure > 0.9) {
      this.setStatus('CRITICAL');
    } 
    // WARNING: Rising errors OR moderate provider instability
    else if (errorRate > 0.2 || latencyAvg > 5000 || !providerAvailability.openai) {
      this.setStatus('WARNING');
    }
    // DEGRADED: Minor performance issues
    else if (errorRate > 0.05 || latencyAvg > 2000) {
      this.setStatus('DEGRADED');
    } 
    else {
      this.setStatus('HEALTHY');
    }
  }

  private setStatus(status: HealthStatus) {
    if (this.currentStatus !== status) {
      console.warn(`[FORGE-HEALTH] State Shift: ${this.currentStatus} -> ${status}`);
      this.currentStatus = status;
      this.syncWithForgeConfig();
    }
  }

  private async syncWithForgeConfig() {
    const { setForgeMode } = await import("./forge-config");
    if (this.currentStatus === 'CRITICAL') setForgeMode('EMERGENCY');
    else if (this.currentStatus === 'WARNING') setForgeMode('SAFE_MODE');
    else if (this.currentStatus === 'DEGRADED') setForgeMode('SAFE_LOW_COST');
    else setForgeMode('PRODUCTION');
  }

  getStatus(): HealthStatus {
    return this.currentStatus;
  }

  getMetrics(): HealthMetrics {
    return this.metrics;
  }
}

export const ecosystemMonitor = EcosystemMonitor.getInstance();
