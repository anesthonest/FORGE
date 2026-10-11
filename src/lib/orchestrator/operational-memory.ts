/**
 * @fileOverview Forge OS Operational Memory
 * Stores historical optimizations and incident resolutions for adaptive learning.
 */

export interface OpsIncident {
  id: string;
  type: 'LATENCY' | 'OVERLOAD' | 'FAILOVER' | 'SECURITY';
  resolution: string;
  impactScore: number;
  timestamp: number;
}

class OperationalMemory {
  private static instance: OperationalMemory;
  private memory: OpsIncident[] = [];

  private constructor() {}

  static getInstance(): OperationalMemory {
    if (!OperationalMemory.instance) {
      OperationalMemory.instance = new OperationalMemory();
    }
    return OperationalMemory.instance;
  }

  /**
   * Commits an operational lesson to persistent memory.
   */
  async commitIncident(type: OpsIncident['type'], resolution: string, impact: number) {
    const incident: OpsIncident = {
      id: `inc-${Math.random().toString(36).slice(2, 7)}`,
      type,
      resolution,
      impactScore: impact,
      timestamp: Date.now()
    };

    this.memory.unshift(incident);
    if (this.memory.length > 50) this.memory.pop();
    
    console.info(`[FORGE-OPS-MEMORY] Committed incident resolution: ${type}`);
  }

  getRecentIncidents(): OpsIncident[] {
    return this.memory;
  }
}

export const opsMemory = OperationalMemory.getInstance();
