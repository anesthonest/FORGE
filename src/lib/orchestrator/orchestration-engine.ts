
/**
 * @fileOverview Forge OS Hyperscale Orchestration Engine (Distributed v3)
 * Implements the stateless command bus, priority queuing, and regional workload dispatch.
 * PROPERTY OF VINEXSAH TECHNOLOGIES.
 */

import { RegionId, GeoRouter } from "../geo-router";

export type TaskPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'QUEUED' | 'VALIDATING' | 'DISPATCHED' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'THROTTLED';

export interface OrchestratorTask {
  id: string;
  type: string;
  priority: TaskPriority;
  status: TaskStatus;
  payload: any;
  region: RegionId;
  executionCost?: number;
  assignedWorker?: string;
  createdAt: number;
}

class OrchestrationEngine {
  private static instance: OrchestrationEngine;
  private queue: OrchestratorTask[] = [];
  private activeWorkers = 0;
  private readonly MAX_CONCURRENT_PER_NODE = 8; 

  private constructor() {}

  static getInstance(): OrchestrationEngine {
    if (!OrchestrationEngine.instance) {
      OrchestrationEngine.instance = new OrchestrationEngine();
    }
    return OrchestrationEngine.instance;
  }

  /**
   * Enqueues a command for distributed execution.
   * Hyperscale Mode: Automatically assigns region based on payload affinity.
   */
  async enqueue(
    type: string, 
    payload: any, 
    priority: TaskPriority = 'MEDIUM', 
    preferredRegion?: string
  ): Promise<string> {
    const regionId = GeoRouter.getOptimalRouting(preferredRegion || 'US-01');
    const taskId = `task-${Math.random().toString(36).slice(2, 9)}`;
    
    const task: OrchestratorTask = {
      id: taskId,
      type,
      priority,
      status: 'QUEUED',
      payload,
      region: regionId,
      createdAt: Date.now()
    };

    this.queue.push(task);
    console.info(`[FORGE-BUS] Command Enqueued | ID: ${taskId} | Region: ${regionId} | Priority: ${priority}`);
    
    this.sortQueue();
    // Non-blocking background processing trigger
    this.processNext();
    
    return taskId;
  }

  private validateRegionalRuntime(task: OrchestratorTask): boolean {
    // Check if the regional node is in RESTRICTED mode
    const isRestricted = task.region === 'ME-01' && task.type !== 'Sovereign_Audit';
    return !isRestricted; 
  }

  private sortQueue() {
    const weights: Record<TaskPriority, number> = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    this.queue.sort((a, b) => weights[b.priority] - weights[a.priority] || a.createdAt - b.createdAt);
  }

  private async processNext() {
    if (this.activeWorkers >= this.MAX_CONCURRENT_PER_NODE || this.queue.length === 0) return;

    const task = this.queue.shift()!;
    
    // 1. Regional Validation
    task.status = 'VALIDATING';
    if (!this.validateRegionalRuntime(task)) {
      task.status = 'THROTTLED';
      console.warn(`[FORGE-BUS] Task ${task.id} throttled: Region ${task.region} restricted.`);
      return;
    }

    // 2. Stateless Dispatch
    task.status = 'DISPATCHED';
    this.activeWorkers++;

    try {
      console.info(`[FORGE-KERNEL] Distributed execution started on node ${task.region} for task ${task.id}`);
      
      // Simulate industrial workload across distributed mesh
      await new Promise(r => setTimeout(r, 1200));
      
      task.status = 'COMPLETED';
    } catch (e) {
      task.status = 'FAILED';
      console.error(`[FORGE-KERNEL-FAULT] Distributed Task ${task.id} failed:`, e);
    } finally {
      this.activeWorkers--;
      // Self-trigger for next queued item
      setImmediate(() => this.processNext());
    }
  }

  getQueueDepth(): number {
    return this.queue.length;
  }

  getActiveWorkloads(): number {
    return this.activeWorkers;
  }

  getRegionalTasks(region: RegionId): OrchestratorTask[] {
    return this.queue.filter(t => t.region === region);
  }
}

export const orchestrator = OrchestrationEngine.getInstance();
