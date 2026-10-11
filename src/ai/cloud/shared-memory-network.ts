import { persistentMemory } from "../core/persistent-memory";

/**
 * @fileOverview ForgeOS Shared Memory Network
 * Enables cross-project learning and global cognitive asset reuse.
 */

export class SharedMemoryNetwork {
  /**
   * Searches the global platform memory for solutions to a similar problem, 
   * regardless of the project that originally generated it.
   */
  static async findGlobalSolution(input: string, taskType: string): Promise<string | null> {
    console.info(`[FORGE-SHARED-MEMORY] Scanning platform-wide mesh for similar intelligence patterns...`);
    
    // Leverage v8 persistent memory core for global similarity matching
    const match = await persistentMemory.retrieve(input, taskType);
    
    if (match && match.success_rate >= 0.85) {
      console.info(`[FORGE-SHARED-MEMORY] Global solution found in ${match.tags[0] || 'unknown'} context.`);
      return typeof match.output === 'string' ? match.output : JSON.stringify(match.output);
    }

    return null;
  }

  /**
   * Commits an intelligence pattern to the global shared memory for future cross-project reuse.
   */
  static async commitGlobalPattern(input: string, output: any, projectId: string, taskType: string) {
    await persistentMemory.store(input, output, `project-${projectId}`, taskType);
    console.info(`[FORGE-SHARED-MEMORY] Pattern committed to platform network from project: ${projectId}`);
  }
}
