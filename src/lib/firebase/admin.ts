
/**
 * @fileOverview Forge OS Server-Side Firebase Admin Singleton
 * PROPERTY OF VINEXSAH TECHNOLOGIES.
 * 
 * Strictly for Node.js runtime (API Routes / Server Actions).
 */

import * as admin from 'firebase-admin';

export function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    try {
      // In Firebase Studio, default credentials are automatically provided by the environment
      admin.initializeApp();
      console.info('[FORGE-INFRA] Server Mesh Handshake: SUCCESS');
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
