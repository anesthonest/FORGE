
import * as functions from "firebase-functions";
import { swarmOrchestrator } from "./ai/core/swarm-orchestrator";

/**
 * @fileOverview ForgeOS v5 Multi-Agent HTTPS Entry Point
 */
export const forgeAutonomousDev = functions.https.onRequest(
  async (req, res) => {
    try {
      const goal = req.body.goal;
      if (!goal) {
        res.status(400).json({ success: false, error: "Human intent 'goal' is required." });
        return;
      }

      // Execute via the Autonomous Swarm Orchestrator
      const result = await swarmOrchestrator(goal);

      res.json({
        success: result.success,
        autonomous: true,
        version: "6.0.0-Autonomous-Swarm",
        result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("[FORGE-SWARM-FAILURE]", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);
