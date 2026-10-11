
'use server';

import { ai } from '@/ai/genkit';
import { forgeGenerate, withAutonomousFallback } from '../core/model-router';

export async function contextualCodeGeneration(input: { description: string }) {
  return withAutonomousFallback('coding', async (model) => {
    const promptText = `Generate the requested code. Provide only the code. No explanation, no markdown.
Description: ${input.description}`;
    const { text } = await forgeGenerate(model, promptText);
    return { codeSnippet: text };
  });
}
