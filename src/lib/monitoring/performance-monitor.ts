/**
 * @fileOverview Forge OS Observability Engine
 * Monitors mesh health, API latency, and worker throughput.
 */

export interface HealthPulse {
  meshState: 'healthy' | 'degraded' | 'critical';
  latencyAvg: number;
  errorCount: number;
  activeWorkers: number;
}

export class PerformanceMonitor {
  private static metrics: {
    totalRequests: number;
    errors: number;
    totalLatency: number;
    meshState: 'healthy' | 'degraded' | 'critical';
  } = {
    totalRequests: 0,
    errors: 0,
    totalLatency: 0,
    meshState: 'healthy'
  };

  /**
   * Records an API execution pulse.
   */
  static logExecution(latency: number, success: boolean) {
    this.metrics.totalRequests++;
    this.metrics.totalLatency += latency;
    if (!success) this.metrics.errors++;
    
    if (this.metrics.errors / this.metrics.totalRequests > 0.1) {
      this.metrics.meshState = 'degraded';
    }
  }

  /**
   * Synthesizes global platform health telemetry.
   */
  static getReport(): HealthPulse {
    return {
      meshState: this.metrics.meshState,
      latencyAvg: this.metrics.totalRequests > 0 ? this.metrics.totalLatency / this.metrics.totalRequests : 0,
      errorCount: this.metrics.errors,
      activeWorkers: 4 // Simulated constant
    };
  }
}
