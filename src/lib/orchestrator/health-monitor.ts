/**
 * @fileOverview Forge OS System Health Monitor (Sovereign Kernel v5)
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 * 
 * Continuously samples mesh vitals and triggers autonomous protection states.
 * Updated for industrial high-concurrency swarms.
 */

export type MeshHealthState = 'NORMAL' | 'PROTECTED' | 'OVERLOAD';

export interface SystemVitals {
  latency: number;
  listeners: number;
  queueDepth: number;
  errorRate: number;
  state: MeshHealthState;
  timestamp: string;
}

class HealthMonitor {
  private static instance: HealthMonitor;
  private currentVitals: SystemVitals = {
    latency: 0,
    listeners: 0,
    queueDepth: 0,
    errorRate: 0,
    state: 'NORMAL',
    timestamp: new Date().toISOString()
  };

  private constructor() {}

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  /**
   * Samples system vitals and recalibrates operational state.
   */
  sample(vitals: Partial<SystemVitals>): SystemVitals {
    this.currentVitals = { 
      ...this.currentVitals, 
      ...vitals,
      timestamp: new Date().toISOString()
    };
    
    // INDUSTRIAL THRESHOLD ANALYSIS
    const { latency, queueDepth, errorRate } = this.currentVitals;

    if (latency > 3000 || queueDepth > 20 || errorRate > 0.3) {
      this.currentVitals.state = 'OVERLOAD';
    } else if (latency > 1500 || queueDepth > 10 || errorRate > 0.1) {
      this.currentVitals.state = 'PROTECTED';
    } else {
      this.currentVitals.state = 'NORMAL';
    }

    if (this.currentVitals.state !== 'NORMAL') {
      console.warn(`[FORGE-HEALTH] Critical Shift: System entered ${this.currentVitals.state} state.`);
    }

    return this.currentVitals;
  }

  getVitals(): SystemVitals {
    return this.currentVitals;
  }

  isThrottling(): boolean {
    return this.currentVitals.state === 'OVERLOAD';
  }

  /**
   * Generates a high-integrity health report for the audit ledger.
   */
  generateIntegrityReport() {
    return {
      status: this.currentVitals.state,
      integrity: 1.0 - this.currentVitals.errorRate,
      latencyScore: Math.max(0, 1.0 - (this.currentVitals.latency / 5000)),
      at: this.currentVitals.timestamp
    };
  }
}

export const healthMonitor = HealthMonitor.getInstance();
