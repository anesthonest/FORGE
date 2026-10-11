/**
 * @fileOverview ForgeOS Native OpenAI Provider v2
 * Direct SDK integration with Quota-Aware and Cache-Ready handling.
 */

import OpenAI from 'openai';
import { rateLimitGuard } from '../core/rate-limit-guard';

let _client: OpenAI | null = null;

function getClient(): OpenAI | null {
  if (_client) return _client;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    console.warn('[Forge-OpenAI] API Key is missing.');
    return null;
  }

  _client = new OpenAI({ apiKey });
  return _client;
}

export async function openaiGenerate(prompt: string, model: string = 'gpt-4o') {
  if (!rateLimitGuard.isAvailable('openai')) {
    throw new Error('QUOTA_EXCEEDED: OpenAI is currently under rate-limit cooldown.');
  }

  const client = getClient();
  if (!client) {
    throw new Error('OpenAI client not initialized.');
  }
  
  try {
    const response = await client.chat.completions.create({
      model: model.replace('openai/', ''),
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return {
      text: response.choices[0].message.content || '',
    };
  } catch (error: any) {
    // Detect 429 Quota/Rate Limit
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
      rateLimitGuard.markLimited('openai');
      return {
        text: JSON.stringify({
          success: false,
          error: "QUOTA_EXCEEDED",
          message: "The AI strategist is currently resting due to quota limits.",
          fallback: true
        })
      };
    }
    
    console.error(`[OpenAI-Provider] failure on model ${model}:`, error.message);
    throw error;
  }
}
