/**
 * @fileOverview Forge OS Intelligence Memory Core
 * High-performance vector-lite retrieval for institutional context.
 */

export interface MemoryUnit {
  id: string;
  hash: string;
  content: string;
  tags: string[];
  lastUsed: string;
  relevance: number;
}

export class IntelligenceMemory {
  private static storage: Map<string, MemoryUnit> = new Map();

  /**
   * Commits an engineering pattern to the persistent memory layer.
   */
  static async commitPattern(content: string, tags: string[] = []) {
    const hash = Buffer.from(content).toString('base64').slice(0, 100);
    const unit: MemoryUnit = {
      id: `mem-${Math.random().toString(36).substr(2, 6)}`,
      hash,
      content,
      tags,
      lastUsed: new Date().toISOString(),
      relevance: 1.0
    };
    
    this.storage.set(hash, unit);
    console.info(`[FORGE-MEMORY] Committed pattern: ${unit.id}`);
  }

  /**
   * Retrieves contextually relevant memories for prompt enrichment.
   */
  static findSimilar(query: string): string[] {
    // Simple keyword-based similarity for prototype
    const terms = query.toLowerCase().split(/\s+/);
    const results: string[] = [];

    this.storage.forEach(unit => {
      const match = terms.some(t => unit.content.toLowerCase().includes(t) || unit.tags.includes(t));
      if (match) results.push(unit.content);
    });

    return results.slice(0, 3);
  }
}
