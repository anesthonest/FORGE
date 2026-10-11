/**
 * @fileOverview ForgeOS Metadata Normalizer (Unified Stability v35)
 * Hardened to ensure 100% serializable outputs for VINEXSAH frontends.
 */

export interface FinalOrchestrationOutput {
  summary: string;
  plan: any[];
  final_code: string;
  quality_score: number;
  workflow_id: string;
  selected_model: string;
  timestamp: string;
  is_conversational: boolean;
  degraded: boolean;
  status: 'SKELETON' | 'FINAL';
  intent?: string;
  operation?: string;
  autonomy_level?: number;
}

export class MetadataNormalizer {
  /**
   * Normalizes execution pulses into a consistent serializable structure.
   * Eliminates all non-serializable objects (snapshots, instances, promises).
   */
  static normalize(raw: any, defaultModel: string = "forge-production-mesh"): FinalOrchestrationOutput {
    // 1. Recursive safety scan (Clone to break references)
    const data = (raw && typeof raw === 'object') ? JSON.parse(JSON.stringify(raw)) : {};
    
    // 2. Resolve Identifiers
    const workflow_id = String(data.workflow_id || data.id || `wf-${Math.random().toString(36).slice(2, 9)}`);

    // 3. Resolve and sanitize model name
    const rawModel = data.selected_model || data.model || defaultModel;
    const selected_model = String(rawModel)
      .replace('googleai/', '')
      .replace('openai/', '')
      .trim() || "production-mesh";

    const intent = String(data.intent || "");
    const operation = String(data.operation || "");

    // 4. Summary Extraction
    const summary = String(
      data.summary || 
      data.plan_summary || 
      data.explanation || 
      data.final_summary || 
      "Operation synchronized with Forge OS Core."
    );
    
    // 5. Artifact Extraction
    const final_code = String(data.final_code || data.code || data.remediation_code || "");
    
    // 6. Quality Metrics
    const rawScore = typeof data.quality_score === 'number' ? data.quality_score : 0.85;
    const quality_score = Number.isFinite(rawScore) ? rawScore : 0.85;

    const is_conversational = Boolean(data.is_conversational || (summary.length < 100 && !final_code));
    const degraded = Boolean(data.degraded || data.is_degraded || data.status === 'timeout');
    const status = data.status === 'SKELETON' ? 'SKELETON' : 'FINAL';
    const autonomy_level = typeof data.autonomy_level === 'number' ? data.autonomy_level : 2;

    // 7. Plan mapping (Ensure array items are plain primitives)
    let plan: any[] = [];
    const rawPlan = data.execution_plan || data.plan || data.steps || data.tasks;
    
    if (Array.isArray(rawPlan)) {
      plan = rawPlan.map(item => {
        if (typeof item === 'object' && item !== null) {
          return { 
            title: String(item.title || item.task || item.name || "Engine Step"),
            description: String(item.description || item.action || item.msg || "Executing..."),
            status: String(item.status || "complete"),
            assignedAgent: String(item.assignedAgent || "Kernel")
          };
        }
        return { title: "Blueprint Step", description: String(item), status: "complete" };
      });
    }

    // 8. Return plain, JSON-serializable object only
    return {
      summary,
      plan,
      final_code,
      quality_score,
      workflow_id,
      selected_model,
      timestamp: String(data.timestamp || new Date().toISOString()),
      is_conversational,
      degraded,
      status,
      intent,
      operation,
      autonomy_level
    };
  }
}
