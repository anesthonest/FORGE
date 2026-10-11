
import { ecosystemMonitor } from "./ecosystem-monitor";
import { SafetyGovernor } from "./safety-governor";
import { setForgeMode } from "./forge-config";

/**
 * @fileOverview ForgeOS Autonomous Recovery Engine (v11)
 * Detects system failure patterns and applies safe, non-destructive remediations.
 */

export class AutonomousRecovery {
  /**
   * Analyzes current health and applies a recovery strategy if needed.
   */
  static async triggerRecovery(failureType: string) {
    const health = ecosystemMonitor.getStatus();
    
    console.info(`[FORGE-RECOVERY] Analyzing failure: ${failureType} | Status: ${health}`);

    // Perform Safety Audit
    const safety = SafetyGovernor.assessAction("RECOVERY_" + failureType, 0.05);
    if (!safety.isSafe) {
      console.error(`[FORGE-RECOVERY] Safety Block: ${safety.reason}`);
      return { status: "blocked", reason: safety.reason };
    }

    if (failureType === 'RATE_LIMIT' || failureType === 'QUOTA_EXCEEDED') {
      return this.handleQuotaFailure();
    }

    if (failureType === 'MODEL_NOT_FOUND') {
      return this.handleModelResolutionFailure();
    }

    return { status: "monitoring" };
  }

  private static async handleQuotaFailure() {
    console.warn("[FORGE-RECOVERY] Strategy: Entering Low-Cost Mode");
    setForgeMode('SAFE_LOW_COST');
    return { status: "recovered", action: "shifted_to_safe_mode" };
  }

  private static async handleModelResolutionFailure() {
    console.warn("[FORGE-RECOVERY] Strategy: Forcing Stable Fallback");
    // This state is managed via the model-router's fallback logic
    return { status: "recovered", action: "fallback_enforced" };
  }
}
