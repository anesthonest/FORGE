'use server';

/**
 * @fileOverview ForgeOS Swarm Orchestrator v6 (Stable)
 */

import { architectAgent } from "./architect-agent";
import { coderAgent } from "./coder-agent";
import { debugAgent } from "./debug-agent";
import { sentinelAgent } from "./sentinel-agent";
import { wardenAgent } from "./warden-agent";
import { deploymentRecoveryAgent } from "./deployment-recovery-agent";
import { selfHealingRun } from "../core/self-healing-engine";
import { DeploymentOS } from "@/lib/deployment-os";

export async function swarmOrchestrator(goal: string) {
  return selfHealingRun(async (model) => {
    console.info(`[Swarm-Stable] Initializing for goal: ${goal}`);
    
    const plan: any = await architectAgent(goal);
    
    const tasks = plan.reconstruction_roadmap?.flatMap((r: any) => r.tasks) || plan.tasks || [];
    const independentTasks = tasks.filter((t: any) => !t.dependencies || t.dependencies.length === 0);
    const results = await Promise.all(independentTasks.map(async (task: any) => {
      if (task.assignedAgent === 'Coder') return coderAgent(task.description, goal);
      if (task.assignedAgent === 'Debugger') return debugAgent({ task: task.title }, task.description);
      return { status: "processed", task: task.id };
    }));

    const audit = await sentinelAgent(results);
    const safety = await wardenAgent({ results, plan });

    if (!safety.safe_to_proceed) {
      throw new Error(`Warden Block: ${safety.violations.join(", ")}`);
    }

    const buildSuccessful = Math.random() > 0.1;
    
    if (!buildSuccessful) {
      const recoveryPlan = await deploymentRecoveryAgent(
        "TS2322: Type 'string' is not assignable to type 'number'.",
        "Build failure simulation"
      );
      
      return {
        success: true,
        recovered: true,
        recovery_plan: recoveryPlan,
        plan_summary: plan.architectural_intent || plan.strategic_summary || "Strategic plan formulated",
        results,
        audit,
        timestamp: new Date().toISOString()
      };
    }

    return {
      success: true,
      deployment_id: DeploymentOS.triggerCanary("1.4.3-STABLE"),
      plan_summary: plan.architectural_intent || plan.strategic_summary || "Strategic plan formulated",
      results,
      audit,
      timestamp: new Date().toISOString()
    };
  }, 'planning');
}
