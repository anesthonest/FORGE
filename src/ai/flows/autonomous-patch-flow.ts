
'use server';

import { ai } from '@/ai/genkit';
import { forgeGenerate, getForgeModel } from '../core/model-router';
import { safeParseJSON } from '../core/self-healing-engine';

export async function generateAutonomousPatch(input: { failureContext: string, suggestedFix: string }) {
  const model = getForgeModel();
  const response = await forgeGenerate(model, `You are the ForgeOS Patch Engine. 
Context: ${input.failureContext}
Fix: ${input.suggestedFix}

Return ONLY valid JSON.
Structure:
{
  "patch_id": "string",
  "is_safe_to_apply": boolean,
  "execution_strategy": "string",
  "remediation_steps": ["string"]
}`);

  return safeParseJSON(response.text, {
    patch_id: "error",
    is_safe_to_apply: false,
    execution_strategy: "Manual review required",
    remediation_steps: []
  });
}
