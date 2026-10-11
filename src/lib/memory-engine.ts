'use client';

/**
 * @fileOverview ForgeOS Cognitive Memory Engine (v2)
 * Client-side interface for persistent memory retrieval and storage.
 * Synchronized with production Firestore rules.
 */

import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  limit, 
  orderBy,
  Firestore
} from 'firebase/firestore';

export type MemoryType = 'fix' | 'decision' | 'pattern' | 'risk';

export interface MemoryEntry {
  type: MemoryType;
  content: string;
  goal_context: string;
  success_rate: number;
}

export class MemoryEngine {
  /**
   * Retrieves relevant memories from Firestore based on type and context.
   */
  static async retrieveRelevantMemories(db: Firestore, userId: string, type: MemoryType): Promise<string> {
    try {
      // Access user-specific memory sub-collection
      const memoryRef = collection(db, 'memory', userId, 'entries');
      
      const q = query(
        memoryRef, 
        where('type', '==', type),
        orderBy('success_rate', 'desc'),
        limit(5)
      );
      
      const snapshot = await getDocs(q);
      const memories = snapshot.docs.map(doc => {
        const data = doc.data();
        return `[MEMORY ${doc.id}]: ${data.content} (Fidelity: ${data.success_rate * 100}%)`;
      });

      return memories.join('\n\n');
    } catch (error) {
      console.error('[MemoryEngine] Retrieval failed:', error);
      return '';
    }
  }

  /**
   * Stores a new cognitive memory entry for a specific operator.
   */
  static async storeMemory(db: Firestore, userId: string, entry: MemoryEntry) {
    try {
      const memoryRef = collection(db, 'memory', userId, 'entries');
      await addDoc(memoryRef, {
        ...entry,
        timestamp: serverTimestamp(),
      });
      console.info(`[MemoryEngine] Asset committed to user context: ${userId}`);
    } catch (err) {
      console.error('[MemoryEngine] Failed to store memory asset:', err);
    }
  }
}
