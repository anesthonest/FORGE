/**
 * @fileOverview ForgeOS Response Normalizer
 * Standardizes inconsistent AI outputs from different providers and fallback paths.
 */

export interface NormalizedAIResponse {
  summary: string;
  plan: any[];
  final_code: string;
  quality_score: number;
  metadata?: any;
}

export class ResponseNormalizer {
  /**
   * Normalizes an untrusted AI response into a safe, consistent schema.
   */
  static normalize(raw: any, fallbackSummary: string = "No summary provided"): NormalizedAIResponse {
    if (!raw) {
      return this.getFallback(fallbackSummary);
    }

    // Handle nested structures like 'final_output' or 'output'
    const data = raw.final_output || raw.output || raw;

    // Extract fields using variations seen across providers
    const summary = data.summary || data.final_summary || data.plan_summary || data.explanation || fallbackSummary;
    const final_code = data.final_code || data.code || data.remediation_code || "";
    const quality_score = typeof data.quality_score === 'number' ? data.quality_score : 
                         (data.is_clean || data.is_approved) ? 1.0 : 0.5;

    // Normalize plan/steps
    let plan = [];
    if (Array.isArray(data.plan)) plan = data.plan;
    else if (Array.isArray(data.steps)) plan = data.steps;
    else if (Array.isArray(data.tasks)) plan = data.tasks;

    return {
      summary,
      plan,
      final_code,
      quality_score,
      metadata: {
        raw_keys: Object.keys(raw),
        was_nested: !!(raw.final_output || raw.output)
      }
    };
  }

  /**
   * Returns a safe default response if normalization fails completely.
   */
  static getFallback(reason: string): NormalizedAIResponse {
    return {
      summary: `System Degradation: ${reason}`,
      plan: [],
      final_code: "",
      quality_score: 0
    };
  }
}
