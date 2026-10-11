
'use server';

/**
 * @fileOverview ForgeOS Coder Agent
 * Specialized in high-fidelity code implementation.
 */

import { forgeGenerate, withAutonomousFallback } from "../core/model-router";
import { safeParseJSON } from "../core/self-healing-engine";

/**
 * Coder: The implementation engine.
 */
export async function coderAgent(taskDescription: string, context: string) {
  return withAutonomousFallback(
    "coding",
    async (model) => {
      const response = await forgeGenerate(model, `
You are the ForgeOS Coder.
Task: ${taskDescription}
Context: ${context}

Deliver production-ready TypeScript/React code.
Ensure adherence to ShadCN and Tailwind standards.
Return ONLY valid JSON.

JSON Structure:
{
  "files": [
    { "path": "string", "content": "string" }
  ],
  "explanation": "string"
}
      `);

      return safeParseJSON(response.text, { 
        files: [], 
        explanation: "Parsing failure" 
      });
    }
  );
}
