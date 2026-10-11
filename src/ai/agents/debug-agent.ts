
'use server';

/**
 * @fileOverview Forge Self-Healing Debug Agent
 */

import { forgeGenerate, withAutonomousFallback } from "../core/model-router";

/**
 * Debug Agent: Analyzes failure context and generates code repairs.
 */
export async function debugAgent(error: any, code: string) {
  return withAutonomousFallback(
    "debug",
    async (model) => {
      const response = await forgeGenerate(model, `
You are Forge Self-Healing Debug AI.

ERROR:
${JSON.stringify(error)}

CODE:
${code}

TASK:
1. Identify root cause
2. Repair the code
3. Preserve architecture
4. Optimize performance
5. Return corrected production-ready code

Return ONLY corrected code.
      `);

      return response.text;
    }
  );
}
