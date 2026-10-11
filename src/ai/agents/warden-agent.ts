
'use server';

/**
 * @fileOverview ForgeOS Warden Agent
 */

import { forgeGenerate, withAutonomousFallback } from "../core/model-router";
import { safeParseJSON } from "../core/self-healing-engine";

/**
 * Warden: The policy enforcer.
 */
export async function wardenAgent(proposedChanges: any) {
  return withAutonomousFallback(
    "reasoning",
    async (model) => {
      const response = await forgeGenerate(model, `
You are the ForgeOS Warden. 
Safety Protocol:
- No file deletions without explicit human approval.
- No overwriting core system files (/src/ai/core/*).

Proposed Changes:
${JSON.stringify(proposedChanges)}

Return ONLY valid JSON.

JSON Structure:
{
  "safe_to_proceed": boolean,
  "violations": ["string"],
  "required_approvals": ["string"]
}
      `);

      return safeParseJSON(response.text, {
        safe_to_proceed: false,
        violations: ["Warden parsing failure"],
        required_approvals: ["Admin"]
      });
    }
  );
}
