
/**
 * @fileOverview ForgeOS Centralized Model Registry
 * Strictly uses stable versions to prevent tool-call compatibility issues.
 * EXPERIMENTAL MODELS ARE FORBIDDEN IN PRODUCTION PATHS.
 */

export const PROVIDERS = {
  GOOGLE: 'googleai',
  OPENAI: 'openai',
} as const;

export const MODELS = {
  // Primary Reasoning (OpenAI) - High Intelligence Stability
  GPT4O: `${PROVIDERS.OPENAI}/gpt-4o`,
  GPT4O_MINI: `${PROVIDERS.OPENAI}/gpt-4o-mini`,
  
  // Stable Reasoning (Google) - Mesh Baseline
  GEMINI_PRO: `${PROVIDERS.GOOGLE}/gemini-1.5-pro`,

  // Performance (Google) - Fast Path / Conversational
  GEMINI_FLASH: `${PROVIDERS.GOOGLE}/gemini-1.5-flash`,
} as const;

export function isGoogleModel(modelId: string): boolean {
  return modelId.startsWith(PROVIDERS.GOOGLE);
}

export function isOpenAIModel(modelId: string): boolean {
  return modelId.startsWith(PROVIDERS.OPENAI);
}
