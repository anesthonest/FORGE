'use client';

/**
 * @fileOverview ForgeOS Firebase Resolution Proxy
 * Re-exports the production-grade Firebase initialization, hooks, and client provider
 * from the /src/firebase directory to resolve import conflicts and provide a unified entry point.
 */

import firebaseConfig from '../firebase-applet-config.json';

export { firebaseConfig };
export * from './firebase/index';
export * from './firebase/provider';
export * from './firebase/client-provider';

