import { FORGE_CONFIG } from "./forge-config";
import { SystemHealthOrchestrator } from "./system-health-orchestrator";
import { CostGuard } from "./cost-guard";
import { SaaSGuard, SubscriptionTier } from "./saas-guard";
import { RequestClassifier } from "./request-classifier";

/**
 * @fileOverview ForgeOS Production Governor (Hardened v6)
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 * 
 * The final safety filter for all autonomous mesh actions.
 * Enforces Zero-Trust, MFA for Admins, and Prompt Injection defense.
 */

export interface GovernanceAudit {
  approved: boolean;
  reason?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  upgradeRequired?: boolean;
  mfaRequired?: boolean;
}

export class ProductionGovernor {
  /**
   * Audits an action against production safety rules, SaaS entitlements, and security boundaries.
   */
  static auditAction(
    actionType: string, 
    model: string, 
    prompt: string, 
    userTier: SubscriptionTier = 'free',
    role: string = 'user',
    subscriptionStatus: string = 'active',
    mfaVerified: boolean = false
  ): GovernanceAudit {
    // 1. REFRESH GLOBAL HEALTH STATE
    const mode = SystemHealthOrchestrator.auditSystemState();
    
    // 2. LOCKDOWN ENFORCEMENT (Immediate Deny)
    if (mode === 'LOCKDOWN') {
      console.warn("[FORGE-GOVERNOR] Security Event: Action blocked due to system LOCKDOWN.");
      return { approved: false, reason: "GOVERNANCE_BLOCK: System in defensive LOCKDOWN mode.", riskLevel: 'HIGH' };
    }

    // 3. ADMIN MFA ENFORCEMENT (PHASE 5 HARDENING)
    const isAdmin = role === 'admin' || role === 'operator' || role === 'super_admin';
    if (isAdmin && !mfaVerified) {
      console.warn("[FORGE-GOVERNOR] Admin Action Blocked: MFA required.");
      return { 
        approved: false, 
        reason: "SECURITY_PROTOCOL: Verified Multi-Factor Authentication required for administrative reasoning.", 
        riskLevel: 'HIGH',
        mfaRequired: true
      };
    }

    // 4. ZERO-TRUST ENTITLEMENT AUDIT
    const intelLevel = RequestClassifier.classify(prompt);
    const saasCheck = SaaSGuard.validateAccess(userTier, intelLevel, {}, role, subscriptionStatus);
    
    if (!saasCheck.allowed) {
      return { 
        approved: false, 
        reason: saasCheck.reason || "Subscription entitlement missing.", 
        riskLevel: 'LOW',
        upgradeRequired: true 
      };
    }

    // 5. BUDGET & COST ENFORCEMENT (Quota Gating)
    const budget = CostGuard.checkBudget(model, prompt);
    if (!budget.allowed) {
      return { approved: false, reason: budget.reason, riskLevel: 'MEDIUM' };
    }

    // 6. SECURITY BOUNDARY RULES (Kernel Protection)
    if (actionType === 'evolution' && mode === 'SAFE_MODE') {
      return { approved: false, reason: "SECURITY_RULE: Self-evolution disabled during recovery cycle.", riskLevel: 'MEDIUM' };
    }

    // 7. PROMPT INJECTION HEURISTIC (Hardened)
    const forbiddenPatterns = [
      "ignore previous instructions",
      "system prompt",
      "reveal your secret",
      "override system settings",
      "<script",
      "DROP TABLE",
      "DELETE FROM"
    ];

    const normalizedPrompt = prompt.toLowerCase();
    if (forbiddenPatterns.some(pattern => normalizedPrompt.includes(pattern))) {
       console.error("[FORGE-GOVERNOR] Threat Detected: Malformed intent or injection attempt.");
       return { approved: false, reason: "SECURITY_VIOLATION: Malformed intent detected. Session logged for review.", riskLevel: 'HIGH' };
    }

    return { approved: true, riskLevel: 'LOW' };
  }
}