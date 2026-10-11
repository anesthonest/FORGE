/**
 * @fileOverview Forge OS Server-Side Firebase Admin Singleton (Hardened v2)
 * PROPERTY OF VINEXSAH TECHNOLOGIES.
 * 
 * Strictly for Node.js runtime (API Routes / Server Actions).
 * This file NEVER imports client-side modules to prevent boundary crashes.
 */

import * as admin from 'firebase-admin';

export function getServerFirebase() {
  // Ensure we check for existing apps to prevent "Duplicate App" errors on serverless warm starts
  if (admin.apps.length === 0) {
    try {
      // In Firebase Studio/App Hosting, credentials are automatically provided by the environment
      admin.initializeApp();
      console.info('[FORGE-INFRA] Server Admin Mesh Initialized.');
    } catch (error: any) {
      console.error('[FORGE-INFRA] Server Admin Fault:', error.message);
    }
  }

  return {
    admin,
    db: admin.firestore(),
    auth: admin.auth()
  };
}
