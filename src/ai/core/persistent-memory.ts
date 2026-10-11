/**
 * @fileOverview ForgeOS Persistent Intelligence Memory Core (v8-Vector-Lite)
 * Provides a high-fidelity storage and retrieval layer for cognitive assets.
 * Optimized for high-speed parallel retrieval and pattern reuse.
 */

import fs from 'fs/promises';
import path from 'path';

export interface CognitiveMemory {
  id: string;
  prompt_hash: string;
  task_type: string;
  input: string;
  output: any;
  model_used: string;
  success_rate: number;
  timestamp: string;
  tags: string[];
}

const MEMORY_FILE = path.join(process.cwd(), 'docs/ai-memory.json');

class PersistentMemory {
  private static instance: PersistentMemory;
  private memoryCache: Map<string, CognitiveMemory> = new Map();
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): PersistentMemory {
    if (!PersistentMemory.instance) {
      PersistentMemory.instance = new PersistentMemory();
    }
    return PersistentMemory.instance;
  }

  private async init() {
    if (this.initialized) return;
    try {
      const data = await fs.readFile(MEMORY_FILE, 'utf-8');
      const memories: CognitiveMemory[] = JSON.parse(data);
      memories.forEach(m => this.memoryCache.set(m.prompt_hash, m));
    } catch (e: any) {
      if (e?.code !== 'ENOENT') {
        console.error('[FORGE-MEMORY] Failed to read memory file:', e);
      }
      await this.save([]);
    }
    this.initialized = true;
  }

  private async save(memories: CognitiveMemory[]) {
    try {
      await fs.writeFile(MEMORY_FILE, JSON.stringify(memories, null, 2), 'utf-8');
    } catch (e) {
      console.error('[FORGE-MEMORY] Persistence failed:', e);
    }
  }

  private generateHash(input: string): string {
    return Buffer.from(input.toLowerCase().trim()).toString('base64').slice(0, 150);
  }

  /**
   * Retrieves a high-fidelity cognitive asset.
   * Uses fuzzy similarity matching to prevent redundant LLM inference.
   */
  async retrieve(input: string, taskType: string): Promise<CognitiveMemory | null> {
    await this.init();
    const hash = this.generateHash(input);
    const exactMatch = this.memoryCache.get(hash);

    if (exactMatch && exactMatch.success_rate >= 0.95) {
      console.info(`[FORGE-MEMORY] Exact Cache Hit for ${taskType}`);
      return exactMatch;
    }

    // High-speed parallel similarity scan
    const memories = Array.from(this.memoryCache.values());
    for (const m of memories) {
      if (m.task_type === taskType && this.calculateSimilarity(input, m.input) > 0.92) {
        console.info(`[FORGE-MEMORY] Pattern Reuse Found: ${m.id}`);
        return m;
      }
    }

    return null;
  }

  async store(input: string, output: any, modelUsed: string, taskType: string) {
    await this.init();
    const hash = this.generateHash(input);
    
    const newMemory: CognitiveMemory = {
      id: `mem-${Math.random().toString(36).substr(2, 9)}`,
      prompt_hash: hash,
      task_type: taskType,
      input,
      output,
      model_used: modelUsed,
      success_rate: 1.0,
      timestamp: new Date().toISOString(),
      tags: [taskType]
    };

    this.memoryCache.set(hash, newMemory);
    await this.save(Array.from(this.memoryCache.values()));
  }

  private calculateSimilarity(s1: string, s2: string): number {
    const set1 = new Set(s1.toLowerCase().split(/\s+/));
    const set2 = new Set(s2.toLowerCase().split(/\s+/));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    return intersection.size / Math.max(set1.size, set2.size);
  }
}

export const persistentMemory = PersistentMemory.getInstance();
