/**
 * @fileOverview ForgeOS Swarm Aggregator
 * Merges parallel agent outputs into a unified, high-integrity response.
 * Handles partial failures by synthesizing best-available intelligence.
 */

import { WatchdogResult } from "./agent-watchdog";

export interface AggregatedSwarm {
  summary: string;
  plan: any[];
  final_code: string;
  quality_score: number;
  is_degraded: boolean;
  agent_traces: Record<string, string>;
}

export class SwarmAggregator {
  /**
   * Aggregates multiple agent outputs into a stable production result.
   */
  static aggregate(
    planner: WatchdogResult<any>,
    builder: WatchdogResult<any>,
    securityAudit: WatchdogResult<any>,
    policyAudit: WatchdogResult<any>
  ): AggregatedSwarm {
    // Determine degradation based on core implementation agents
    const is_degraded = 
      builder.health !== 'ACTIVE' || 
      planner.health !== 'ACTIVE';

    // 1. Synthesize Summary
    let summary = builder.data.explanation || planner.data.strategic_summary || "Autonomous intelligence recovered from parallel mesh logs.";

    if (is_degraded) {
      summary = `[Mesh Recovery] ${summary}`;
    }

    // 2. Synthesize Code
    const final_code = builder.data.files?.[0]?.content || "";

    // 3. Synthesize Plan
    const plan = planner.data.tasks || [];

    // 4. Quality Score Synthesis
    const baseScore = securityAudit.data.quality_score || 0.85;
    const quality_score = policyAudit.data.safe_to_proceed ? baseScore : baseScore * 0.5;

    return {
      summary,
      plan,
      final_code,
      quality_score,
      is_degraded,
      agent_traces: {
        architect: planner.health,
        coder: builder.health,
        sentinel: securityAudit.health,
        warden: policyAudit.health
      }
    };
  }
}
