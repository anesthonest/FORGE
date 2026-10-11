/**
 * @fileOverview Forge OS AI Agent Orchestrator
 * Manages agent registration, task delegation, and execution life-cycles.
 * PROPERTY OF VINEXSAH TECHNOLOGIES.
 */

import { eventSystem } from "@/lib/events/event-system";
import { logForgeEvent } from "@/ai/core/event-logger";

export type AgentRole = 
  | 'Analytics' 
  | 'Billing' 
  | 'Infra-Monitor' 
  | 'AI-Optimizer' 
  | 'Notification' 
  | 'Compliance' 
  | 'Workflow';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'queued' | 'active' | 'completed' | 'failed' | 'retrying';

export interface AgentTask {
  id: string;
  type: string;
  role: AgentRole;
  priority: TaskPriority;
  status: TaskStatus;
  payload: any;
  result?: any;
  error?: string;
  attempts: number;
  createdAt: number;
}

export interface MeshAgent {
  id: string;
  name: string;
  role: AgentRole;
  status: 'idle' | 'busy' | 'recovering';
  capabilities: string[];
  executionCount: number;
  costAccrued: number;
}

class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private agents: Map<string, MeshAgent> = new Map();
  private taskQueue: AgentTask[] = [];
  private activeTasks: Map<string, AgentTask> = new Map();

  private constructor() {
    this.initializeDefaultAgents();
  }

  static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  private initializeDefaultAgents() {
    const defaultRoles: AgentRole[] = ['Analytics', 'Billing', 'Infra-Monitor', 'AI-Optimizer', 'Notification', 'Compliance', 'Workflow'];
    defaultRoles.forEach((role, i) => {
      this.registerAgent({
        id: `agt-prime-${role.toLowerCase()}`,
        name: `${role}-Prime`,
        role,
        status: 'idle',
        capabilities: [`execute_${role.toLowerCase()}_logic`, 'cross_agent_sync'],
        executionCount: 0,
        costAccrued: 0
      });
    });
  }

  registerAgent(agent: MeshAgent) {
    this.agents.set(agent.id, agent);
    console.info(`[FORGE-AGENT] Agent Registered: ${agent.name} (${agent.role})`);
  }

  async enqueueTask(role: AgentRole, type: string, payload: any, priority: TaskPriority = 'medium'): Promise<string> {
    const taskId = `task-${Math.random().toString(36).substr(2, 9)}`;
    const task: AgentTask = {
      id: taskId,
      type,
      role,
      priority,
      status: 'queued',
      payload,
      attempts: 0,
      createdAt: Date.now()
    };

    this.taskQueue.push(task);
    this.sortQueue();
    
    console.info(`[FORGE-ORCHESTRATOR] Task Enqueued [${priority.toUpperCase()}]: ${type}`);
    this.processQueue();
    
    return taskId;
  }

  private sortQueue() {
    const priorityWeights = { critical: 4, high: 3, medium: 2, low: 1 };
    this.taskQueue.sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority] || a.createdAt - b.createdAt);
  }

  private async processQueue() {
    if (this.taskQueue.length === 0) return;

    // Find available agents for the next tasks
    for (let i = 0; i < this.taskQueue.length; i++) {
      const task = this.taskQueue[i];
      const availableAgent = Array.from(this.agents.values()).find(a => a.role === task.role && a.status === 'idle');

      if (availableAgent) {
        this.taskQueue.splice(i, 1);
        this.executeTask(task, availableAgent);
        i--; // Adjust index since we removed an item
      }
    }
  }

  private async executeTask(task: AgentTask, agent: MeshAgent) {
    agent.status = 'busy';
    task.status = 'active';
    this.activeTasks.set(task.id, task);

    console.info(`[FORGE-MESH] Dispatching ${task.type} to ${agent.name}`);
    eventSystem.dispatch('agent_executed', { taskId: task.id, agentId: agent.id });

    try {
      // Simulate specialized logic execution
      await new Promise(r => setTimeout(r, 2000 + Math.random() * 3000));
      
      task.status = 'completed';
      task.result = { status: "success", timestamp: Date.now() };
      agent.executionCount++;
      agent.costAccrued += 0.004; // Simulated CVU cost

      await logForgeEvent({
        type: 'ai_execution',
        userId: 'system-agent',
        source: agent.name,
        action: task.type,
        metadata: { taskId: task.id, duration: 3000, cost: 0.004 }
      });

    } catch (error: any) {
      task.status = 'failed';
      task.error = error.message;
      console.error(`[FORGE-AGENT-FAULT] ${agent.name} failed task ${task.id}:`, error.message);
    } finally {
      agent.status = 'idle';
      this.activeTasks.delete(task.id);
      this.processQueue(); // Look for more work
    }
  }

  getMeshStats() {
    return {
      totalAgents: this.agents.size,
      activeAgents: Array.from(this.agents.values()).filter(a => a.status === 'busy').length,
      queueDepth: this.taskQueue.length,
      agents: Array.from(this.agents.values()),
      recentTasks: Array.from(this.activeTasks.values())
    };
  }
}

export const agentOrchestrator = AgentOrchestrator.getInstance();
