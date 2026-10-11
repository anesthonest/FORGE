'use server';
/**
 * @fileOverview ForgeOS Lightweight Chat Response Engine
 * Provides fast conversational replies without swarm overhead.
 */

import { forgeGenerate, getForgeModel } from '../core/model-router';

export async function chatResponseFlow(input: string): Promise<string> {
  const model = getForgeModel('generation');
  
  const prompt = `You are Forge OS, a professional autonomous AI engineering platform. 
Answer this query politely and briefly. Do not use any internal engine terminology like "Task Synthesis", "Orchestration", or "Swarm".
If the user asks who you are, explain that you are an autonomous engineering fabric.

User Query: ${input}`;

  const response = await forgeGenerate(model, prompt, 'generation');
  return response.text;
}
