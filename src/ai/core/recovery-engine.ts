/**
 * @fileOverview ForgeOS Crash Recovery Engine
 * Provides a deterministic fallback wrapper for critical system operations.
 */

/**
 * Executes a primary operation with a safe fallback mechanism.
 * @param operation The primary async function to attempt.
 * @param fallback The secondary async function to execute upon failure.
 * @returns The result of the successful operation.
 */
export async function recoveryEngine<T>(
  operation: () => Promise<T>,
  fallback: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error("[Forge Recovery] Primary execution path failed. Initiating fallback...", error);
    return fallback();
  }
}
