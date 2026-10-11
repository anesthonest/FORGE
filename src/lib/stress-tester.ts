/**
 * @fileOverview Forge OS Stress Testing Framework
 * Simulates high-concurrency AI reasoning and infrastructure load.
 */

export interface StressMetrics {
  iterations: number;
  avgLatency: number;
  successRate: number;
  providerDistribution: Record<string, number>;
}

export class StressTester {
  /**
   * Executes a simulated high-concurrency load test against the AI Gateway.
   */
  static async runInferenceTest(iterations: number = 10): Promise<StressMetrics> {
    const start = Date.now();
    let successes = 0;
    const providerStats: Record<string, number> = { google: 0, openai: 0 };
    
    console.info(`[FORGE-STRESS] Initializing scale test: ${iterations} iterations.`);

    const tasks = Array.from({ length: iterations }).map(async (_, i) => {
      try {
        // Dynamic simulated call
        await new Promise(r => setTimeout(r, 500 + Math.random() * 1000));
        successes++;
        
        // Randomize provider for stat simulation
        const p = Math.random() > 0.5 ? 'google' : 'openai';
        providerStats[p]++;
        
        return { success: true, id: i };
      } catch (e) {
        console.error('[FORGE-STRESS] Task iteration failure:', e);
        return { success: false, id: i };
      }
    });

    await Promise.all(tasks);

    return {
      iterations,
      avgLatency: (Date.now() - start) / iterations,
      successRate: (successes / iterations) * 100,
      providerDistribution: providerStats
    };
  }

  /**
   * Generates a simulated audit trail for testing telemetry UI.
   */
  static generateDummyAudit(count: number = 20) {
    return Array.from({ length: count }).map((_, i) => ({
      id: `sim-log-${i}`,
      userId: `user-${Math.floor(Math.random() * 5)}`,
      action: 'AI_REQUEST',
      timestamp: new Date(Date.now() - (i * 60000)).toISOString(),
      provider: Math.random() > 0.5 ? 'googleai' : 'openai',
      status: 'success'
    }));
  }
}
