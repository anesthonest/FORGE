'use client';

/**
 * @fileOverview Forge OS Client-Side Firebase Singleton (Industrial Turbo v3)
 * PROPERTY OF VINEXSAH TECHNOLOGIES.
 * 
 * Strictly for use in browser runtime. Enforces a single instance rule.
 * Instrumented with multi-tab persistence for offline-ready stability.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, enableMultiTabIndexedDbPersistence, terminate } from 'firebase/firestore';
import { getAuth, Auth, signOut } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from '@/firebase/config';

let clientApp: FirebaseApp | null = null;
let clientDb: Firestore | null = null;
let clientAuth: Auth | null = null;
let clientStorage: FirebaseStorage | null = null;

/**
 * Retrieves or initializes the singleton Firebase instance for the client.
 */
export function getClientFirebase() {
  if (typeof window === 'undefined') {
    return { 
      app: null, 
      db: null, 
      auth: null, 
      storage: null, 
      firebaseApp: null, 
      firestore: null, 
      configError: undefined 
    };
  }

  if (!clientApp) {
    try {
      const apps = getApps();
      clientApp = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
      clientDb = getFirestore(clientApp);
      clientAuth = getAuth(clientApp);
      clientStorage = getStorage(clientApp);

      // Enable offline persistence for industrial-grade stability
      if (!(clientDb as any)['_persistenceEnabled']) {
        (clientDb as any)['_persistenceEnabled'] = true;
        enableMultiTabIndexedDbPersistence(clientDb).catch((err) => {
          console.error('[FORGE-INFRA] Persistence deferred:', err.code, err);
        });
      }

      console.info('[FORGE-INFRA] Client Mesh Initialized.');
    } catch (error: any) {
      console.error('[FORGE-INFRA] Client Init Fault:', error.message);
    }
  }

  return { 
    app: clientApp, 
    db: clientDb, 
    auth: clientAuth, 
    storage: clientStorage,
    firebaseApp: clientApp,
    firestore: clientDb,
    configError: undefined
  };
}

/**
 * Forcefully terminates the local Firebase mesh context.
 * Used for emergency re-syncs and security resets.
 */
export async function terminateClientMesh() {
  const { auth, db } = getClientFirebase();
  
  if (auth) {
    try { await signOut(auth); } catch (e) {
      console.error('[FORGE-FIREBASE] SignOut fault during termination:', e);
    }
  }

  if (db) {
    try { await terminate(db); } catch (e) {
      console.error('[FORGE-FIREBASE] DB termination fault:', e);
    }
  }

  clientApp = null;
  clientDb = null;
  clientAuth = null;
  clientStorage = null;
  
  console.info('[FORGE-INFRA] Client Mesh Terminated.');
}
