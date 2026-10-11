import { ArchitectureAnalyzer, SystemHealthReport } from "./architecture-analyzer";
import { SafePatchEngine, ArchitecturePatch } from "./safe-patch-engine";
import { persistentMemory } from "./persistent-memory";

/**
 * @fileOverview ForgeOS Evolution Controller (v11)
 * Manages the self-improvement loop for adaptive intelligence.
 * Implements No Reduction Policy: Enhancements only.
 */

export class EvolutionController {
  /**
   * Executes a full evolution cycle: Audit -> Proposal -> Risk Assessment.
   */
  static async runEvolutionCycle() {
    console.info("[FORGE-EVOLUTION] Initializing adaptive self-improvement cycle...");

    // 1. System Audit
    const audit = await ArchitectureAnalyzer.performSystemAudit();
    
    // Self-optimization threshold adjusted for high-fidelity needs
    if (audit.score > 0.98) {
      console.info("[FORGE-EVOLUTION] System operating at peak adaptive efficiency.");
      return { status: "optimized", audit };
    }

    // 2. Select priority improvement target
    const target = audit.detectedWeaknesses[0] || "Adaptive Path Optimization";

    // 3. Propose Enhancement (Evolution ensures no functionality is degraded)
    const patch = await SafePatchEngine.proposePatch(target, JSON.stringify(audit));

    // 4. Safety Audit & Capability Validation
    const isSafe = this.validateEvolutionSafety(patch);

    if (isSafe) {
      // 5. Store in Persistent Memory (v8) as a new capability or pattern
      await persistentMemory.store(
        `EVOLUTION_ENHANCEMENT_${patch.id}`, 
        patch, 
        "Evolution-Controller-Expansion", 
        "architecture"
      );
      
      console.info(`[FORGE-EVOLUTION] Enhancement ${patch.id} approved and registered in memory.`);
      return { status: "capability_registered", patch };
    }

    console.warn(`[FORGE-EVOLUTION] Enhancement ${patch.id} deferred to preserve stability.`);
    return { status: "deferred", reason: "Safety rule constraint" };
  }

  /**
   * Enforces strict safety rules against system-degrading changes.
   */
  private static validateEvolutionSafety(patch: ArchitecturePatch): boolean {
    const forbiddenPaths = ["/src/ai/core", "/src/ai/providers"];
    
    // Expansion Rule: patches must be enhancements, not reductions.
    if (patch.risk_level === "high") return false;

    // Module boundary check to protect the expansion kernel
    if (forbiddenPaths.some(p => patch.target_module.includes(p))) {
      console.error(`[FORGE-EVOLUTION] KERNEL PROTECTION: Modification of expansion core blocked.`);
      return false;
    }

    return true;
  }
}
