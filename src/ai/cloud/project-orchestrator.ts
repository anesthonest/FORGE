/**
 * @fileOverview ForgeOS Cloud Project Orchestrator
 * Manages registration and isolation of multiple projects or modules within the mesh.
 */

export interface ProjectConfig {
  id: string;
  name: string;
  quotaLimitUsd: number;
  priority: 'low' | 'standard' | 'high';
  status: 'active' | 'suspended' | 'archived';
}

class ProjectOrchestrator {
  private static instance: ProjectOrchestrator;
  private projects: Map<string, ProjectConfig> = new Map();

  private constructor() {
    // Register default platform root
    this.registerProject({
      id: 'platform-root',
      name: 'Forge Cloud Core',
      quotaLimitUsd: 10.00,
      priority: 'high',
      status: 'active'
    });
  }

  static getInstance(): ProjectOrchestrator {
    if (!ProjectOrchestrator.instance) {
      ProjectOrchestrator.instance = new ProjectOrchestrator();
    }
    return ProjectOrchestrator.instance;
  }

  /**
   * Registers a new module or project into the cloud mesh.
   */
  registerProject(config: ProjectConfig) {
    this.projects.set(config.id, config);
    console.info(`[FORGE-CLOUD] Project registered: ${config.name} (${config.id})`);
  }

  /**
   * Retrieves configuration for a specific project context.
   */
  getProject(projectId: string): ProjectConfig | undefined {
    return this.projects.get(projectId);
  }

  /**
   * Executes a task within a strict project isolation boundary.
   */
  async executeInContext<T>(projectId: string, task: () => Promise<T>): Promise<T> {
    const config = this.getProject(projectId);
    if (!config || config.status !== 'active') {
      throw new Error(`PROJECT_ISOLATION_ERROR: Context ${projectId} is unavailable or suspended.`);
    }

    console.info(`[FORGE-CLOUD] Executing task in context: ${projectId}`);
    return await task();
  }

  getActiveProjects(): ProjectConfig[] {
    return Array.from(this.projects.values()).filter(p => p.status === 'active');
  }
}

export const projectOrchestrator = ProjectOrchestrator.getInstance();
