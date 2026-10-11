'use client';

/**
 * @fileOverview Forge OS Singleton Firebase Kernel Proxy
 * Rediects to the context-safe client singleton.
 * Ensures the Web SDK is never loaded on the server.
 */

import { getClientFirebase } from '@/lib/firebase/client';

export function initializeFirebase() {
  return getClientFirebase();
}
