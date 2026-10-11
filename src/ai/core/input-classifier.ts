/**
 * @fileOverview ForgeOS Input Classifier
 * Routes user queries between lightweight conversation and full swarm orchestration.
 */

export type InputCategory = 'CONVERSATIONAL' | 'ENGINEERING';

const CASUAL_TRIGGERS = [
  'hi', 'hello', 'hey', 'help', 'who are you', 'what is your name', 
  'thanks', 'good morning', 'good afternoon', 'how are you', 'what can you do'
];

const ENGINEERING_TRIGGERS = [
  'build', 'create', 'debug', 'fix', 'implement', 'architecture', 
  'deploy', 'optimize', 'refactor', 'system', 'infrastructure', 'module'
];

export class InputClassifier {
  /**
   * Determines if a request requires full swarm orchestration or simple chat.
   */
  static classify(input: string): InputCategory {
    const normalized = input.toLowerCase().trim();

    // 1. Explicit engineering triggers always force swarm
    if (ENGINEERING_TRIGGERS.some(t => normalized.includes(t))) {
      return 'ENGINEERING';
    }

    // 2. Casual triggers or very short inputs route to chat
    if (CASUAL_TRIGGERS.some(t => normalized.includes(t)) || normalized.length < 15) {
      return 'CONVERSATIONAL';
    }

    // 3. Complex or long engineering-sounding prompts route to swarm
    if (normalized.length > 50) {
      return 'ENGINEERING';
    }

    // Default to conversational for safety and speed
    return 'CONVERSATIONAL';
  }
}
