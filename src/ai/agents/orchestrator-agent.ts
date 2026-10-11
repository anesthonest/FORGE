'use server';

/**
 * @fileOverview ForgeOS Orchestrator Agent (v5 - Plugin Optimized)
 * Enhanced for Parallel Execution and Dynamic Plugin Discovery.
 */

import { forgeGenerate } from "../core/model-router";
import { selfHealingRun, safeParseJSON } from "../core/self-healing-engine";

// ToolCall type definition for mesh distribution
export type ToolCall = {
  tool_name: string;
  operation: string;
  input: any;
  expected_output: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies?: string[];
};

export type DecompositionResult = {
  pipeline_summary: string;
  execution_mode: 'parallel' | 'sequential';
  tool_calls: ToolCall[];
  dynamic_tools: string[];
};

/**
 * Orchestration Brain: Converts user goals into a deterministic parallel execution pipeline.
 */
export async function orchestrationBrain(goal: string): Promise<DecompositionResult> {
  return selfHealingRun(
    async (model) => {
      const response = await forgeGenerate(model, `
You are Forge Autonomous Dev Brain. 
Your task is to convert the following goal into a high-concurrency tool-calling pipeline.

GOAL:
${goal}

AVAILABLE TOOLS:
- AI_Reasoning_Tool: For reasoning, synthesis, or creative generation.
- Firestore_Tool: For database CRUD operations (users, projects, logs).
- Billing_Tool: For credit checks and usage metering.
- System_Tool: For internal navigation and OS operations.
- Plugin_Execution_Tool: For triggering modular extensions (Auth-Hardener, Telemetry-Visualizer).
- Custom_Generated_Tool: For complex tasks requiring dynamic tool composition.

TASK:
1. Interpret intent.
2. Break goal into subtasks.
3. Map subtasks to tools. 
4. If the goal relates to plugins, auth, or telemetry, prioritize the Plugin_Execution_Tool.
5. Decide if tasks can run in SIMULTANEOUS (parallel) or must run in SEQUENCE (sequential).
   - If subtasks have no dependencies, prefer "parallel" for speed.
   - If subtasks depend on previous results, use "sequential".

OUTPUT JSON STRUCTURE:
{
  "pipeline_summary": "string",
  "execution_mode": "parallel | sequential",
  "tool_calls": [
    {
      "tool_name": "string",
      "operation": "string",
      "input": {},
      "expected_output": "string",
      "priority": "low | medium | high | critical",
      "dependencies": ["tool_name_of_dependency"]
    }
  ],
  "dynamic_tools": ["names of any custom tools designed for this goal"]
}
      `);

      return safeParseJSON<DecompositionResult>(response.text, {
        pipeline_summary: "Orchestrator failure. Sequential recovery active.",
        execution_mode: 'sequential',
        tool_calls: [{
          tool_name: "AI_Reasoning_Tool",
          operation: "text_synthesis",
          input: { prompt: goal },
          expected_output: "Human-readable response",
          priority: "high"
        }],
        dynamic_tools: []
      });
    },
    "architecture"
  );
}
