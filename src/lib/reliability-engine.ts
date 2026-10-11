
/**
 * @fileOverview ForgeOS Execution Reliability Engine
 * Handles retries, checkpoints, and workflow recovery.
 */

export interface ReliabilityConfig {
  maxRetries: number;
  checkpointEnabled: boolean;
}

export async function withReliability<T>(
  operation: () => Promise<T>,
  config: ReliabilityConfig = { maxRetries: 3, checkpointEnabled: true }
): Promise<T> {
  let attempts = 0;
  
  while (attempts < config.maxRetries) {
    try {
      return await operation();
    } catch (error) {
      attempts++;
      console.error(`[FORGE-RELIABILITY] Execution attempt ${attempts}/${config.maxRetries} failed:`, error);
      if (attempts >= config.maxRetries) throw error;
      
      // Exponential backoff
      await new Promise(r => setTimeout(r, Math.pow(2, attempts) * 1000));
    }
  }
  
  throw new Error("Reliability Engine: Maximum retry attempts reached.");
}
