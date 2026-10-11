
'use server';

/**
 * @fileOverview ForgeOS Specialized Swarm Agents
 * Implements the Planner, Builder, Debugger, and Reviewer.
 */

import { forgeGenerate } from "../core/model-router";
import { safeParseJSON } from "../core/self-healing-engine";
import { MODELS } from "../core/model-registry";

/**
 * Planner: The strategist who decomposes goals into execution steps.
 */
export async function plannerAgent(goal: string) {
  const prompt = `You are the ForgeOS Planner.
GOAL: ${goal}

TASK:
1. Break this goal into 3-5 deterministic engineering steps.
2. Identify dependencies.
3. Return ONLY valid JSON.

JSON Structure:
{
  "strategic_plan": "string",
  "steps": [
    { "id": number, "title": "string", "description": "string", "requires_debug": boolean }
  ]
}`;
  
  const response = await forgeGenerate(MODELS.GPT4O, prompt, 'planning');
  return safeParseJSON(response.text, { strategic_plan: "Default Execution", steps: [] });
}

/**
 * Builder: The implementation engine for code and logic.
 */
export async function builderAgent(taskDescription: string, context: string) {
  const prompt = `You are the ForgeOS Builder.
TASK: ${taskDescription}
CONTEXT: ${context}

TASK:
1. Implement the requested logic or code.
2. Adhere to Next.js 15 and Tailwind standards.
3. Return ONLY valid JSON.

JSON Structure:
{
  "code": "string",
  "explanation": "string",
  "files_touched": ["string"]
}`;

  const response = await forgeGenerate(MODELS.GEMINI_FLASH, prompt, 'coding');
  return safeParseJSON(response.text, { code: "", explanation: "Implementation failed", files_touched: [] });
}

/**
 * Debugger: The validator who fixes errors and sanitizes logic.
 */
export async function debuggerAgent(implementation: any, errorContext?: string) {
  const prompt = `You are the ForgeOS Debugger.
IMPLEMENTATION: ${JSON.stringify(implementation)}
${errorContext ? `ERROR: ${errorContext}` : ''}

TASK:
1. Identify bugs or anti-patterns.
2. Propose a fix or validation report.
3. Return ONLY valid JSON.

JSON Structure:
{
  "is_clean": boolean,
  "found_issues": ["string"],
  "remediation_code": "string"
}`;

  const response = await forgeGenerate(MODELS.GEMINI_FLASH, prompt, 'debug');
  return safeParseJSON(response.text, { is_clean: false, found_issues: ["Debugger failure"], remediation_code: "" });
}

/**
 * Reviewer: The final auditor who merges swarm outputs.
 */
export async function reviewerAgent(plan: any, implementation: any, debugReport: any) {
  const prompt = `You are the ForgeOS Reviewer.
PLAN: ${JSON.stringify(plan)}
BUILD: ${JSON.stringify(implementation)}
DEBUG: ${JSON.stringify(debugReport)}

TASK:
1. Merge the implementation and remediation into a final consistent output.
2. Remove any redundancy.
3. Ensure the final result meets the original plan.
4. Return ONLY valid JSON.

JSON Structure:
{
  "final_summary": "string",
  "final_code": "string",
  "quality_score": number
}`;

  const response = await forgeGenerate(MODELS.GPT4O_MINI, prompt, 'reasoning');
  return safeParseJSON(response.text, { final_summary: "Reviewer failure", final_code: "", quality_score: 0 });
}
