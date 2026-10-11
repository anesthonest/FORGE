/**
 * @fileOverview ForgeOS Response Formatter
 * The final transformation layer that converts internal AI logs into natural language.
 * Ensures zero leakage of execution IDs, swarm markers, or engine states.
 */

export class ResponseFormatter {
  /**
   * Transforms raw synthesized output into a polished, user-facing response.
   */
  static toNaturalLanguage(raw: string, userGoal: string): string {
    if (!raw) return "I've processed your request. How else can I assist with your engineering goals?";

    // 1. Handle explicit conversational overrides
    const normalizedGoal = userGoal.toLowerCase().trim();
    if (this.isIdentityQuery(normalizedGoal)) {
      return "I am Forge OS, your autonomous AI engineering assistant. I'm here to help you build, debug, and orchestrate complex software systems.";
    }
    if (this.isGreeting(normalizedGoal)) {
      return "Hello! I'm Forge OS. I'm ready to assist with your engineering tasks. What are we building today?";
    }

    // 2. Aggressive metadata scrubbing
    let formatted = raw
      // Remove Swarm/Task Synthesis markers
      .replace(/Task Synthesis:?/gi, "")
      .replace(/Execution Summary:?/gi, "")
      // Remove Internal IDs (e.g., ID: swarm-l6, wf-123)
      .replace(/ID: [a-z0-9-]{4,}/gi, "")
      .replace(/Workflow ID: [a-z0-9-]{4,}/gi, "")
      // Remove Mesh Recovery markers and convert to natural language
      .replace(/\[Mesh Recovery\]/gi, "System recovery")
      .replace(/Implementation verified/gi, "The implementation has been successfully verified")
      // Remove provider/model labels that might have leaked
      .replace(/DEEP_REASONING:?/gi, "")
      .replace(/MEMORY-RECOVERY:?/gi, "Retrieved from optimized patterns")
      // Clean up whitespace and artifacts
      .replace(/\s+/g, " ")
      .trim();

    // 3. Structural Reconstruction
    // If the response is too "log-heavy", wrap it in a natural sentence
    if (formatted.startsWith("System recovery")) {
      formatted = `Forge has successfully completed the task and verified ${formatted.toLowerCase()}. Everything is operating normally.`;
    }

    return formatted || "I've completed the requested analysis. Please see the technical details in the trace logs below.";
  }

  private static isIdentityQuery(input: string): boolean {
    return input.includes("who are you") || input.includes("your name") || input.includes("what is forge");
  }

  private static isGreeting(input: string): boolean {
    return input === "hi" || input === "hello" || input === "hey" || input.startsWith("hi ");
  }
}
