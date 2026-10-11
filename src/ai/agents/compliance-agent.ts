'use server';

/**
 * @fileOverview ForgeOS Enterprise Compliance Agent
 * Enforces policy rules for HIPAA, GDPR, PCI-DSS, and Enterprise Governance.
 */

import { forgeGenerate, withAutonomousFallback } from "../core/model-router";
import { safeParseJSON } from "../core/self-healing-engine";

export async function complianceAgent(operation: any, domain: string = 'enterprise') {
  return withAutonomousFallback(
    "reasoning",
    async (model) => {
      const response = await forgeGenerate(model, `
You are the ForgeOS Elite Compliance Agent.
Domain: ${domain.toUpperCase()}

Audit the following requested operation for policy compliance:
${JSON.stringify(operation)}

Analyze for:
1. Data Residency (GDPR)
2. Regulated Data Handling (HIPAA/PCI)
3. Audit Trail Integrity
4. Permission Escalation Risks

Return ONLY valid JSON.

JSON Structure:
{
  "is_compliant": boolean,
  "violation_report": {
    "detected_risks": ["string"],
    "policy_violations": ["string"]
  },
  "audit_trail_id": "string",
  "safe_execution_path": "string"
}
      `);

      return safeParseJSON(response.text, { 
        is_compliant: false, 
        violation_report: { detected_risks: ["Audit failed"], policy_violations: ["Engine timeout"] },
        audit_trail_id: "error-audit",
        safe_execution_path: "Manual review required"
      });
    }
  );
}
