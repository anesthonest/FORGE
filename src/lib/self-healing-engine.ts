
/**
 * @fileOverview ForgeOS Self-Healing Engine
 * Layer 2: Diagnosis | Layer 3: Healing
 * Detects failures and triggers autonomous recovery protocols.
 */

export type FailureType = 'MODEL_NOT_FOUND' | 'RATE_LIMIT' | 'TIMEOUT' | 'AUTH_FAILURE' | 'UNKNOWN';

export class SelfHealingEngine {
  /**
   * Diagnoses the root cause of an AI operation failure.
   */
  static diagnose(error: any): FailureType {
    const message = error?.message?.toLowerCase() || String(error).toLowerCase();
    
    if (message.includes('404') || message.includes('not found')) {
      return 'MODEL_NOT_FOUND';
    }
    if (message.includes('429') || message.includes('quota') || message.includes('limit')) {
      return 'RATE_LIMIT';
    }
    if (message.includes('timeout') || message.includes('deadline')) {
      return 'TIMEOUT';
    }
    if (message.includes('auth') || message.includes('permission') || message.includes('api key')) {
      return 'AUTH_FAILURE';
    }
    
    return 'UNKNOWN';
  }

  /**
   * Logs a healing event and determines if recovery is possible.
   */
  static async logHealingEvent(type: FailureType, context: any) {
    console.warn(`[FORGE-SELF-HEALING] Action Required: ${type}`);
    console.info(`[FORGE-SELF-HEALING] Context: ${JSON.stringify(context)}`);
    
    // In a production scenario, this would write to the Sovereign Data Lake
    // for historical analysis and evolution training.
  }
}
