'use client';

/**
 * @fileOverview Forge OS Safe Data Access Layer
 * PROPERTY OF VINEXSAH TECHNOLOGIES.
 * 
 * High-integrity wrappers with integrated observability hooks.
 */

import { doc, getDoc, collection, getDocs, Firestore, DocumentData } from 'firebase/firestore';

export interface AccessDiagnostic {
  exists: boolean;
  empty: boolean;
  error?: string;
  latency: number;
}

/**
 * Safely retrieves an enterprise-scoped document with observability.
 */
export async function safeGetDoc<T = DocumentData>(
  db: Firestore | null, 
  userId: string,
  path: string, 
  fallback: T
): Promise<T> {
  if (!db || !userId || typeof window === 'undefined') return fallback;

  const start = Date.now();
  try {
    const docRef = doc(db, "users", userId, ...path.split('/'));
    const snap = await getDoc(docRef);
    
    if (snap.exists()) {
      return { ...fallback, ...snap.data() } as T;
    }
    
    return fallback;
  } catch (error: any) {
    console.warn(`[FORGE-TRACE] Access Fault at ${path}:`, error.message);
    return fallback;
  }
}

/**
 * Safely retrieves a collection with zero-empty UI guarantees and diagnostic trace.
 */
export async function safeGetCollection<T = any>(
  db: Firestore | null,
  path: string,
  fallback: T[] = []
): Promise<T[]> {
  if (!db || typeof window === 'undefined') return fallback;

  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    
    if (snap.empty) {
      return fallback;
    }
    
    return snap.docs.map(d => ({ ...d.data(), id: d.id }) as T);
  } catch (error: any) {
    console.error(`[FORGE-TRACE] Collection Fault at ${path}:`, error.message);
    return fallback;
  }
}
