'use server';
/**
 * @fileOverview A flow for intelligent debugging using unified multi-provider routing.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { withAutonomousFallback, forgeGenerate } from '../core/model-router';
import { safeParseJSON } from '../core/self-healing-engine';

const IntelligentCodeDebuggingInputSchema = z.object({
  codeSnippet: z.string(),
  errorLogs: z.string(),
  context: z.string().optional(),
});
export type IntelligentCodeDebuggingInput = z.infer<typeof IntelligentCodeDebuggingInputSchema>;

const IntelligentCodeDebuggingOutputSchema = z.object({
  analysis: z.string(),
  suggestedFixes: z.array(
    z.object({
      description: z.string(),
      codeChange: z.string(),
      canBeAppliedAutomatically: z.boolean(),
    })
  ),
});
export type IntelligentCodeDebuggingOutput = z.infer<typeof IntelligentCodeDebuggingOutputSchema>;

export async function intelligentCodeDebugging(input: IntelligentCodeDebuggingInput): Promise<IntelligentCodeDebuggingOutput> {
  return intelligentCodeDebuggingFlow(input);
}

// Internal implementation bypassing Genkit Prompt object for multi-provider stability
const intelligentCodeDebuggingFlow = ai.defineFlow(
  {
    name: 'intelligentCodeDebuggingFlow',
    inputSchema: IntelligentCodeDebuggingInputSchema,
    outputSchema: IntelligentCodeDebuggingOutputSchema,
  },
  async (input) => {
    return withAutonomousFallback('debug', async (model) => {
      const promptText = `Analyze and fix the code issue.
Code: ${input.codeSnippet}
Logs: ${input.errorLogs}
${input.context ? `Context: ${input.context}` : ''}

Return ONLY valid JSON.
Structure:
{
  "analysis": "string",
  "suggestedFixes": [
    { "description": "string", "codeChange": "string", "canBeAppliedAutomatically": boolean }
  ]
}`;

      const { text } = await forgeGenerate(model, promptText);
      return safeParseJSON<IntelligentCodeDebuggingOutput>(text, {
        analysis: "Failure during automated analysis",
        suggestedFixes: []
      });
    });
  }
);
