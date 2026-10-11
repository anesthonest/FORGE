/**
 * @fileOverview ForgeOS 5-Tier Request Classifier (Optimized for Enterprise Expansion)
 * Stage 1: Input Normalization | Stage 2: Intent Engine | Stage 3: Tier Assignment
 */

export type ForgeOperation = 
  | 'deployment_operation'
  | 'qa_operation'
  | 'compliance_operation'
  | 'ui_generation'
  | 'system_operation'
  | 'autonomous_operation'
  | 'workflow_execution'
  | 'automation_operation'
  | 'ai_task';

export type RequestIntelligenceLevel = 'ASSISTANT' | 'BUILDER' | 'ENGINEER' | 'AUTOPILOT' | 'AUTONOMOUS';
export type ExecutionTier = 'TIER_1' | 'TIER_2' | 'TIER_3';

const ASSISTANT_TRIGGERS = ['hi', 'hello', 'help', 'explain', 'what is', 'how does', 'thanks'];
const BUILDER_TRIGGERS = ['write code', 'generate function', 'create file', 'refactor this', 'fix bug', 'implement logic'];
const ENGINEER_TRIGGERS = ['design system', 'architect database', 'plan api', 'security audit', 'performance optimization'];
const AUTOPILOT_TRIGGERS = ['build application', 'generate full system', 'create saas', 'complete project', 'deploy stack'];
const DEPLOY_TRIGGERS = ['deploy', 'rollback', 'infrastructure', 'staging', 'production', 'monitoring', 'scale'];
const QA_TRIGGERS = ['test', 'qa', 'audit', 'validation', 'vulnerability', 'simulate', 'security scan'];
const COMPLIANCE_TRIGGERS = ['hipaa', 'gdpr', 'pci', 'compliance', 'regulation', 'audit trail', 'policy'];

export class RequestClassifier {
  static classify(prompt: string): RequestIntelligenceLevel {
    const normalized = prompt.toLowerCase().trim();

    if (normalized.includes('autonomous') || normalized.includes('self-healing') || normalized.includes('mesh') || normalized.length > 250) {
      return 'AUTONOMOUS';
    }

    if (AUTOPILOT_TRIGGERS.some(t => normalized.includes(t)) || normalized.length > 120) {
      return 'AUTOPILOT';
    }

    if (ENGINEER_TRIGGERS.some(t => normalized.includes(t)) || normalized.length > 60) {
      return 'ENGINEER';
    }

    if (BUILDER_TRIGGERS.some(t => normalized.includes(t))) {
      return 'BUILDER';
    }

    const isCasual = ASSISTANT_TRIGGERS.some(t => normalized === t || normalized.startsWith(t + ' '));
    if (isCasual && normalized.length < 40) {
      return 'ASSISTANT';
    }

    return 'BUILDER';
  }

  static mapToExactIntent(level: RequestIntelligenceLevel, prompt: string): ForgeOperation {
    const normalized = prompt.toLowerCase().trim();

    if (DEPLOY_TRIGGERS.some(t => normalized.includes(t))) return 'deployment_operation';
    if (QA_TRIGGERS.some(t => normalized.includes(t))) return 'qa_operation';
    if (COMPLIANCE_TRIGGERS.some(t => normalized.includes(t))) return 'compliance_operation';
    
    if (normalized.includes('ui') || normalized.includes('dashboard') || normalized.includes('view') || normalized.includes('screen')) return 'ui_generation';
    if (normalized.includes('system') || normalized.includes('admin') || normalized.includes('config') || normalized.includes('os')) return 'system_operation';
    
    if (level === 'AUTONOMOUS') return 'autonomous_operation';
    if (level === 'AUTOPILOT' || level === 'ENGINEER') return 'workflow_execution';
    if (level === 'BUILDER') return 'automation_operation';
    
    return 'ai_task';
  }

  static determineTier(level: RequestIntelligenceLevel, prompt: string): ExecutionTier {
    const normalized = prompt.toLowerCase().trim();
    if (level === 'ASSISTANT' && normalized.length < 50) return 'TIER_1';
    if (level === 'AUTONOMOUS' || normalized.includes('optimize background') || normalized.includes('maintenance')) return 'TIER_3';
    return 'TIER_2';
  }
}
