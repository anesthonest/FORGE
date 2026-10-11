
'use server';

/**
 * @fileOverview Elite Blueprint Intelligence Engine
 * Handles semantic analysis and reconstruction planning for technical blueprints.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { architectAgent } from '../agents/architect-agent';
import { forgeGenerate, withAutonomousFallback } from '../core/model-router';
import { safeParseJSON } from '../core/self-healing-engine';

const BlueprintInputSchema = z.object({
  blueprintContent: z.string().describe("The raw text or markdown content of the blueprint, system spec, or OpenAPI document."),
  format: z.enum(['markdown', 'openapi', 'json_schema', 'text']).default('markdown'),
});

const BlueprintOutputSchema = z.object({
  analysis: z.object({
    services: z.array(z.string()),
    topology: z.string(),
    dataFlow: z.array(z.string()),
    securityModel: z.string(),
  }),
  reconstructionPlan: z.any(),
});

export async function analyzeAndReconstruct(input: z.infer<typeof BlueprintInputSchema>) {
  return analyzeFlow(input);
}

const analyzeFlow = ai.defineFlow(
  {
    name: 'analyzeFlow',
    inputSchema: BlueprintInputSchema,
    outputSchema: BlueprintOutputSchema,
  },
  async (input) => {
    // 1. Core Architectural Analysis
    const reconstructionPlan = await architectAgent(input.blueprintContent);

    // 2. Semantic Intent Extraction
    const extractionResult = await withAutonomousFallback('reasoning', async (model) => {
       const res = await forgeGenerate(model, `
          Analyze the following blueprint for semantic engineering intent. 
          Extract service boundaries, API topology, and data flow patterns.
          
          BLUEPRINT: ${input.blueprintContent}
          
          Return ONLY valid JSON.
          {
            "services": ["string"],
            "topology": "REST | GraphQL | Event-Driven",
            "dataFlow": ["A -> B", "B -> DB"],
            "securityModel": "string"
          }
       `);
       return safeParseJSON<any>(res.text, { services: [], topology: "Unknown", dataFlow: [], securityModel: "Basic" });
    });

    return {
      analysis: extractionResult,
      reconstructionPlan,
    };
  }
);
