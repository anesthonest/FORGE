
'use server';

/**
 * @fileOverview ForgeOS Sentinel - Enterprise Quality Gate
 */

import { forgeGenerate, withAutonomousFallback } from "../core/model-router";
import { safeParseJSON } from "../core/self-healing-engine";

/**
 * Sentinel: The validator, auditor, and production quality gate.
 */
export async function sentinelAgent(implementation: any) {
  return withAutonomousFallback(
    "reasoning",
    async (model) => {
      const response = await forgeGenerate(model, `
You are the ForgeOS Sentinel Enterprise Quality Gate. 
Audit the following implementation for production suitability:
${JSON.stringify(implementation)}

Analyze for:
- Observability (Logging/Metrics)
- Resilience (Retry loops/Circuit breakers)
- Security (Sanitization/Auth)
- Architectural integrity (Pattern adherence)

Return ONLY valid JSON.

JSON Structure:
{
  "is_approved": boolean,
  "quality_score": number (0-1),
  "vulnerabilities": ["string"],
  "improvement_suggestions": ["string"],
  "enterprise_readiness_report": "string"
}
      `);

      return safeParseJSON(response.text, {
        is_approved: false,
        quality_score: 0,
        vulnerabilities: ["Sentinel parsing failure"],
        improvement_suggestions: [],
        enterprise_readiness_report: "Audit interrupted."
      });
    }
  );
}
