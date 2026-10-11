'use server';

/**
 * @fileOverview ForgeOS Enterprise QA Agent
 * Autonomous test scenario generation and vulnerability detection.
 */

import { forgeGenerate, withAutonomousFallback } from "../core/model-router";
import { safeParseJSON } from "../core/self-healing-engine";

export async function qaAgent(codeContext: string, intent: string) {
  return withAutonomousFallback(
    "debug",
    async (model) => {
      const response = await forgeGenerate(model, `
You are the ForgeOS Enterprise QA Swarm Agent.
Analyze the following code context and intent to perform high-fidelity testing.

CONTEXT:
${codeContext}

INTENT:
${intent}

TASK:
1. Generate test scenarios for edge-cases.
2. Identify potential UI/API integration breakpoints.
3. Perform a security validation (credentials, dependencies, injection).
4. Detect unsafe patterns.

Return ONLY valid JSON.

JSON Structure:
{
  "test_report": {
    "scenarios": [
      { "id": "string", "type": "integration" | "security" | "ui", "description": "string", "severity": "low" | "medium" | "high" }
    ],
    "vulnerabilities": ["string"],
    "repair_suggestions": ["string"],
    "quality_score": number (0-1)
  }
}
      `);

      return safeParseJSON(response.text, { 
        test_report: { scenarios: [], vulnerabilities: ["Parsing failure"], repair_suggestions: [], quality_score: 0 }
      });
    }
  );
}
