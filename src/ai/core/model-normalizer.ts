/**
 * @fileOverview ForgeOS Model Normalizer
 * Ensures model identifiers are always present and sanitized for UI/Audit consumption.
 */

/**
 * Sanitizes a model identifier for display.
 * @param model The raw model string from the provider.
 * @returns A safe, sanitized string.
 */
export function normalizeModelName(model: any): string {
  if (!model || typeof model !== 'string') return "unknown";
  
  // Remove provider prefixes and trim
  return model
    .replace('googleai/', '')
    .replace('openai/', '')
    .trim() || "unknown";
}

/**
 * Ensures a result object has a valid selected_model field.
 */
export function ensureModelMetadata<T extends object>(obj: T, defaultModel: string = "unknown"): T & { selected_model: string } {
  const casted = obj as any;
  return {
    ...obj,
    selected_model: casted.selected_model || defaultModel
  };
}
