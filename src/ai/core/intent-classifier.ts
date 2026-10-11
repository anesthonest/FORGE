/**
 * @fileOverview ForgeOS Intent Classifier
 * Determines the required intelligence level for a prompt.
 * Enables cost-efficient conversational responses and deep autonomous engineering.
 */

export type ExecutionMode = 'LIGHTWEIGHT' | 'FULL_AUTONOMOUS';

const CASUAL_TRIGGERS = [
  'hi', 'hello', 'hey', 'help', 'who are you', 'what is your name', 
  'how are you', 'what can you do', 'good morning', 'good afternoon'
];

const ENGINEERING_TRIGGERS = [
  'build', 'create', 'debug', 'fix', 'implement', 'architecture', 
  'deploy', 'optimize', 'refactor', 'code', 'module', 'system'
];

/**
 * Classifies a user prompt to determine if full swarm orchestration is required.
 */
export function classifyIntent(prompt: string): ExecutionMode {
  const normalized = prompt.toLowerCase().trim();

  // Rule 1: Short conversational prompts are always lightweight
  if (normalized.length < 12) {
    const isCasual = CASUAL_TRIGGERS.some(trigger => normalized.includes(trigger));
    if (isCasual) return 'LIGHTWEIGHT';
  }

  // Rule 2: Explicit casual phrases
  if (CASUAL_TRIGGERS.some(trigger => normalized === trigger)) {
    return 'LIGHTWEIGHT';
  }

  // Rule 3: Presence of engineering keywords forces full autonomous mode
  const isEngineering = ENGINEERING_TRIGGERS.some(trigger => normalized.includes(trigger));
  if (isEngineering) return 'FULL_AUTONOMOUS';

  // Rule 4: Default to Full Autonomous for long/complex prompts to preserve intelligence
  if (normalized.length > 50) {
    return 'FULL_AUTONOMOUS';
  }

  // Final Fallback: Start lightweight if unclear, swarm handles the rest if triggered later
  return 'LIGHTWEIGHT';
}
