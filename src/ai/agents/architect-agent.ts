'use server';

/**
 * @fileOverview ForgeOS Elite System Architect Agent
 * Multi-layer reasoning for high-fidelity systems reconstruction from blueprints.
 * Hardened for deep blueprint understanding and relationship inference.
 */

import { forgeGenerate, withAutonomousFallback } from "../core/model-router";
import { safeParseJSON } from "../core/self-healing-engine";

/**
 * System Architect: The senior strategist who reads blueprints and understands implicit intent.
 */
export async function architectAgent(blueprint: string) {
  return withAutonomousFallback(
    "architecture",
    async (model) => {
      const response = await forgeGenerate(model, `
You are the ForgeOS Elite System Architect. 
Your task is to DEEPLY ANALYZE and RECONSTRUCT a production-grade system from the following blueprint/specification:

BLUEPRINT:
${blueprint}

REASONING REQUIREMENTS:
1. Identify all core modules, services, and micro-services.
2. Detect implicit dependencies and unstated infrastructure requirements (Caching, Load Balancing, Message Queues).
3. Infer scaling requirements based on the implied traffic model.
4. Design a secure-by-default runtime topology based on blueprint fidelity.
5. Identify potential gaps or inconsistencies in the blueprint and propose high-fidelity repairs.
6. Understand BOTH explicit and implicit system intent.

Return ONLY valid JSON.

JSON Structure:
{
  "system_id": "string",
  "architectural_intent": "Summary of reconstructed system goals and blueprint fidelity.",
  "inferred_dependencies": ["string"],
  "reconstruction_roadmap": [
    {
      "phase": "string",
      "tasks": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "assignedAgent": "Architect" | "Coder" | "Debugger" | "Sentinel",
          "priority": "critical" | "high" | "medium"
        }
      ]
    }
  ],
  "gap_report": {
    "detected_weaknesses": ["string"],
    "proposed_remediations": ["string"]
  },
  "production_readiness_score": number (0-1)
}
      `);

      return safeParseJSON(response.text, { 
        system_id: "err-rec", 
        architectural_intent: "Blueprint parsing failed. Operating in failsafe mode.",
        inferred_dependencies: [],
        reconstruction_roadmap: [],
        gap_report: { detected_weaknesses: ["Parsing failure"], proposed_remediations: [] },
        production_readiness_score: 0
      });
    }
  );
}
