/**
 * @fileOverview ForgeOS Global Cost & Swarm Configuration (Production v17)
 * Implements strict budget caps, parallel limits, and autonomy levels.
 * Standardized for Level 0-3 Autonomy Rules.
 */

export type ForgeMode = 'PRODUCTION' | 'INTELLIGENT' | 'SAFE_LOW_COST' | 'EMERGENCY' | 'PROTECTED' | 'SAFE_MODE' | 'LOCKDOWN';
export type AutonomyLevel = 0 | 1 | 2 | 3;

export const FORGE_CONFIG = {
  MODE: 'PRODUCTION' as ForgeMode,
  AUTONOMY_LEVEL: 2 as AutonomyLevel, // 0: Manual, 1: Assisted, 2: Semi-Auto, 3: Full-Auto
  CACHE_TTL_MS: 3600000,        // 1 hour
  PERSISTENT_REUSE: true,       // Tier 1 Memory active
  SIMILARITY_THRESHOLD: 0.90,    // High-fidelity matching for production
  MAX_RETRIES_PER_STEP: 1,      // Strict cost control
  SWARM_MAX_PARALLEL: 5,        // Parallel agent ceiling
  COOLDOWN_MS: 45000,           // Progressive 429 backoff
  BUDGET_CAP_USD: 10.00,        // Session budget cap
  TOTAL_SPEND_USD: 0,           // Tracked spend
  MAX_CONCURRENCY: 10           // Concurrency ceiling
};

export function setForgeMode(mode: ForgeMode) {
  if (FORGE_CONFIG.MODE !== mode) {
    FORGE_CONFIG.MODE = mode;
    console.info(`[FORGE-CONFIG] Mesh shifted to: ${mode}`);
  }
}

export function setAutonomyLevel(level: AutonomyLevel) {
  FORGE_CONFIG.AUTONOMY_LEVEL = level;
  console.info(`[FORGE-CONFIG] Autonomy level synchronized to: Level ${level}`);
}

export function updateSpend(amount: number) {
  FORGE_CONFIG.TOTAL_SPEND_USD += amount;
}
