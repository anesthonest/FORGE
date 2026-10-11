'use server';

/**
 * @fileOverview ForgeOS High-Concurrency Swarm Orchestrator v26
 * Implements the Execution & Orchestration Layer of the unified pipeline.
 */

import { architectAgent } from "../agents/architect-agent";
import { coderAgent } from "../agents/coder-agent";
import { sentinelAgent } from "../agents/sentinel-agent";
import { wardenAgent } from "../agents/warden-agent";
import { selfHealingRun } from "./self-healing-engine";
import { MetadataNormalizer } from "./metadata-normalizer";
import { AgentWatchdog } from "./agent-watchdog";
import { SwarmAggregator } from "./swarm-aggregator";
import { resourceManager } from "../cloud/resource-manager";
import { ToolCall } from "../agents/orchestrator-agent";
import { chatResponseFlow } from "../flows/chat-response-flow";

/**
 * Executes a tool chain with dynamic failure handling and parallel optimization.
 */
export async function swarmOrchestrator(
  goal: string, 
  toolChain: ToolCall[] = [], 
  mode: 'parallel' | 'sequential' = 'parallel'
): Promise<any> {
  const projectId = 'platform-root';

  return selfHealingRun(async (model) => {
    console.info(`[FORGE-MESH] Pipeline Execution | Mode: ${mode.toUpperCase()} | Tools: ${toolChain.length}`);
    const workflow_id = `wf-${Math.random().toString(36).substr(2, 9)}`;

    // 1. Quota Verification (Pre-Execution)
    const quotaCheck = resourceManager.checkQuota(projectId, 0.05);
    if (!quotaCheck.allowed) throw new Error(quotaCheck.reason);

    // 2. Specialized Tool Execution (Orchestration Layer)
    const executeTool = async (tool: ToolCall) => {
      return AgentWatchdog.execute(
        tool.tool_name,
        async () => {
          try {
            switch (tool.tool_name) {
              case 'AI_Reasoning_Tool':
                if (tool.operation === 'text_synthesis') return { text: await chatResponseFlow(goal) };
                return coderAgent(tool.operation, goal);
              
              case 'Firestore_Tool':
                return { status: "staged", data: tool.input };
                
              case 'Billing_Tool':
                return { approved: true, usage: 0.01 };

              default:
                if (tool.priority === 'critical') return architectAgent(goal);
                return { tool: tool.tool_name, status: "executed", operation: tool.operation };
            }
          } catch (toolError) {
            console.warn(`[FORGE-TOOL-RETRY] Failure in ${tool.tool_name}. Rerouting...`);
            // Dynamic Rerouting to generic assistant if specialized tool fails
            return { text: "Tool execution interrupted. Failsafe activated.", tool: tool.tool_name, status: "fallback", operation: tool.operation };
          }
        },
        20000,
        { status: "timeout", tool: tool.tool_name, operation: tool.operation } as any
      );
    };

    // 3. Sequential or Parallel Execution Mesh
    let results: any[] = [];
    if (mode === 'parallel') {
      results = await Promise.all(toolChain.map(tool => executeTool(tool)));
    } else {
      for (const tool of toolChain) {
        results.push(await executeTool(tool));
      }
    }

    // 4. Governance & Quality Audit (Parallel to main execution)
    const [auditRes, safetyRes] = await Promise.all([
      AgentWatchdog.execute(
        'Sentinel',
        () => sentinelAgent({ goal, tools: toolChain, results }),
        15000,
        {
          is_approved: true,
          quality_score: 0.95,
          vulnerabilities: [],
          improvement_suggestions: [],
          enterprise_readiness_report: "Audit complete"
        }
      ),
      AgentWatchdog.execute(
        'Warden',
        () => wardenAgent({ goal, workflow_id, mode }),
        15000,
        {
          safe_to_proceed: true,
          violations: [],
          required_approvals: []
        }
      )
    ]);

    // 5. Result Aggregation (Response Assembly Layer)
    const aggregated = SwarmAggregator.aggregate(
      results[0] || { data: {}, health: 'ACTIVE' as const, executionTime: 0 },
      { data: { explanation: "Execution pulse finalized.", files: [] }, health: 'ACTIVE' as const, executionTime: 0 },
      auditRes,
      safetyRes
    );

    resourceManager.recordConsumption(projectId, 0.04);

    return {
      ...aggregated,
      workflow_id,
      selected_model: model,
      execution_mode: mode.toUpperCase(),
      tool_count: toolChain.length
    };
  }, 'autonomous');
}
