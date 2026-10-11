
import { AutonomousRecovery } from "./autonomous-recovery";
import { ProductionGovernor } from "./production-governor";
import { setForgeMode } from "./forge-config";

/**
 * @fileOverview ForgeOS Auto-Recovery Controller (Production v12)
 * Orchestrates recovery actions under strict governance.
 */

export class AutoRecoveryController {
  /**
   * Triggers a governed recovery sequence for a detected failure.
   */
  static async executeRecovery(failureType: string) {
    console.info(`[FORGE-RECOVERY-CTRL] Initiating recovery for: ${failureType}`);

    // Check with Governor
    const audit = ProductionGovernor.auditAction("recovery", "SYSTEM", failureType);
    
    if (!audit.approved) {
      console.warn(`[FORGE-RECOVERY-CTRL] Governor Blocked Recovery: ${audit.reason}`);
      return { success: false, reason: audit.reason };
    }

    // High-Risk Recovery Actions
    if (failureType === 'CASCADING_FAILURE' || failureType === 'RATE_LIMIT_STORM') {
      setForgeMode('SAFE_MODE');
      return { success: true, action: "FORCED_SAFE_MODE" };
    }

    // Delegate to Engine for Low-Risk Actions
    return await AutonomousRecovery.triggerRecovery(failureType);
  }
}
