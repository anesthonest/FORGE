/**
 * @fileOverview ForgeOS Agent Watchdog System
 * Monitors agent health, enforces timeouts, and manages failover states.
 */

export type AgentHealth = 'ACTIVE' | 'DEGRADED' | 'UNAVAILABLE';

export interface WatchdogResult<T> {
  data: T;
  health: AgentHealth;
  executionTime: number;
}

export class AgentWatchdog {
  /**
   * Executes an agent task with a hard timeout and deterministic fallback.
   * Prevents any single agent from blocking the entire swarm pipeline.
   */
  static async execute<T>(
    agentName: string,
    task: () => Promise<T>,
    timeoutMs: number,
    fallback: T
  ): Promise<WatchdogResult<T>> {
    const start = Date.now();
    
    try {
      // Race the agent task against a hard timeout
      const result = await Promise.race([
        task(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`${agentName} execution exceeded ${timeoutMs}ms`)), timeoutMs)
        )
      ]);

      return {
        data: result as T,
        health: 'ACTIVE',
        executionTime: Date.now() - start
      };
    } catch (error: any) {
      console.warn(`[FORGE-WATCHDOG] Agent ${agentName} failure detected: ${error.message}`);
      
      // Classify health based on failure type
      const health: AgentHealth = error.message.includes('timeout') ? 'DEGRADED' : 'UNAVAILABLE';
      
      return {
        data: fallback,
        health,
        executionTime: Date.now() - start
      };
    }
  }
}
