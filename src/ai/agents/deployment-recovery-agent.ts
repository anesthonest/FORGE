
'use server';

/**
 * @fileOverview ForgeOS Deployment Recovery Agent
 */

import { forgeGenerate, withAutonomousFallback } from "../core/model-router";
import { safeParseJSON } from "../core/self-healing-engine";

/**
 * Deployment Recovery Agent: The infrastructure healer.
 */
export async function deploymentRecoveryAgent(failureLog: string, context: string) {
  return withAutonomousFallback(
    "debug",
    async (model) => {
      const response = await forgeGenerate(model, `
You are the ForgeOS Deployment Recovery Agent.
An infrastructure or build failure has occurred.

FAILURE LOG:
${failureLog}

CONTEXT:
${context}

TASK:
1. Identify if the failure is: BUILD_ERROR, DEPENDENCY_CONFLICT, or RUNTIME_CRASH.
2. Generate a precise code patch or configuration change to fix the issue.
3. Ensure the fix is compatible with Firebase and Next.js 15 standards.

Return ONLY valid JSON.

JSON Structure:
{
  "failure_type": "BUILD_ERROR" | "DEPENDENCY_CONFLICT" | "RUNTIME_CRASH",
  "root_cause": "string",
  "remediation_steps": ["string"],
  "patch_content": "string",
  "target_file": "string",
  "risk_assessment": "low" | "medium" | "high"
}
      `);

      return safeParseJSON(response.text, {
        failure_type: "BUILD_ERROR",
        root_cause: "Recovery agent parsing failure",
        remediation_steps: [],
        patch_content: "",
        target_file: "",
        risk_assessment: "high"
      });
    }
  );
}
