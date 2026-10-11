
/**
 * @fileOverview ForgeOS AI Response Cache
 * Prevents redundant API calls by caching high-entropy outputs.
 */

import { FORGE_CONFIG } from './forge-config';

interface CacheEntry {
  response: any;
  timestamp: number;
}

class ResponseCache {
  private static instance: ResponseCache;
  private cache: Map<string, CacheEntry> = new Map();

  private constructor() {}

  static getInstance(): ResponseCache {
    if (!ResponseCache.instance) {
      ResponseCache.instance = new ResponseCache();
    }
    return ResponseCache.instance;
  }

  private generateKey(model: string, prompt: string): string {
    const normalized = prompt.toLowerCase().trim();
    // Use base64 to handle complex prompt strings safely
    return `${model}:${Buffer.from(normalized).toString('base64').slice(0, 150)}`;
  }

  set(model: string, prompt: string, response: any) {
    if (FORGE_CONFIG.MODE === 'EMERGENCY') return; // Don't pollute cache during failures
    const key = this.generateKey(model, prompt);
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
    });
  }

  get(model: string, prompt: string): any | null {
    const key = this.generateKey(model, prompt);
    const entry = this.cache.get(key);

    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > FORGE_CONFIG.CACHE_TTL_MS;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    console.info(`[FORGE-CACHE] Hit for ${model}`);
    return entry.response;
  }

  clear() {
    this.cache.clear();
  }
}

export const responseCache = ResponseCache.getInstance();
