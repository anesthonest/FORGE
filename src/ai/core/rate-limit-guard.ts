
/**
 * @fileOverview ForgeOS Provider Health Guard
 * Implements exponential backoff awareness for API providers.
 */

import { FORGE_CONFIG } from './forge-config';

export type AIProvider = 'openai' | 'googleai';

interface ProviderStatus {
  isLimited: boolean;
  cooldownUntil: number;
}

class RateLimitGuard {
  private static instance: RateLimitGuard;
  private status: Record<AIProvider, ProviderStatus> = {
    openai: { isLimited: false, cooldownUntil: 0 },
    googleai: { isLimited: false, cooldownUntil: 0 },
  };

  private constructor() {}

  static getInstance(): RateLimitGuard {
    if (!RateLimitGuard.instance) {
      RateLimitGuard.instance = new RateLimitGuard();
    }
    return RateLimitGuard.instance;
  }

  markLimited(provider: AIProvider) {
    console.warn(`[FORGE-GUARD] Provider ${provider} cooling down for ${FORGE_CONFIG.COOLDOWN_MS}ms`);
    this.status[provider] = {
      isLimited: true,
      cooldownUntil: Date.now() + FORGE_CONFIG.COOLDOWN_MS,
    };
  }

  isAvailable(provider: AIProvider): boolean {
    const s = this.status[provider];
    if (!s.isLimited) return true;
    
    if (Date.now() > s.cooldownUntil) {
      s.isLimited = false;
      return true;
    }
    return false;
  }
}

export const rateLimitGuard = RateLimitGuard.getInstance();
