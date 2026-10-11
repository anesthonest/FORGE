/**
 * @fileOverview ForgeOS Dynamic Plugin System (Modular Architecture v2)
 * Manages the lifecycle, registration, and execution of modular extensions.
 */

export type PluginType = 'ai' | 'automation' | 'ui' | 'data' | 'system';

export interface ForgePlugin {
  plugin_id: string;
  version: string;
  type: PluginType;
  capabilities: string[];
  triggers: string[]; // Keywords or patterns that activate this plugin
  execution_flow: any[]; // Chained execution steps
  status: 'active' | 'disabled';
  author: string;
  name: string;
  description: string;
}

class PluginSystem {
  private static instance: PluginSystem;
  private plugins: Map<string, ForgePlugin> = new Map();

  private constructor() {
    // Register default system plugins
    this.registerPlugin({
      plugin_id: 'plg-core-auth',
      name: 'Auth-Hardener',
      version: '1.0.0',
      type: 'system',
      capabilities: ['session_validation', 'token_scrubbing'],
      triggers: ['login', 'security', 'auth', 'access'],
      execution_flow: [{ step: "validate_session", priority: "critical" }],
      status: 'active',
      author: 'Vinexsah-Core',
      description: 'Enterprise-grade session scrubbing and JWT validation.'
    });

    this.registerPlugin({
      plugin_id: 'plg-data-viz',
      name: 'Telemetry-Visualizer',
      version: '1.2.0',
      type: 'ui',
      capabilities: ['chart_generation', 'real_time_feed'],
      triggers: ['telemetry', 'stats', 'monitor', 'visualize'],
      execution_flow: [{ step: "render_telemetry_mesh", mode: "parallel" }],
      status: 'active',
      author: 'Forge-Labs',
      description: 'Real-time telemetry rendering for swarm activity.'
    });

    this.registerPlugin({
      plugin_id: 'plg-ai-opt',
      name: 'LLM-Optimization-Pack',
      version: '2.1.0',
      type: 'ai',
      capabilities: ['prompt_compression', 'token_savings'],
      triggers: ['optimize', 'tokens', 'cost', 'efficiency'],
      execution_flow: [{ step: "compress_context", target: "ai_task" }],
      status: 'active',
      author: 'Vinexsah-Core',
      description: 'Reduces token overhead by compressing engineering prompts.'
    });
  }

  static getInstance(): PluginSystem {
    if (!PluginSystem.instance) {
      PluginSystem.instance = new PluginSystem();
    }
    return PluginSystem.instance;
  }

  registerPlugin(plugin: ForgePlugin) {
    this.plugins.set(plugin.plugin_id, plugin);
    console.info(`[FORGE-PLUGINS] Plugin registered: ${plugin.name} v${plugin.version}`);
  }

  getPlugin(id: string): ForgePlugin | undefined {
    return this.plugins.get(id);
  }

  getActivePlugins(): ForgePlugin[] {
    return Array.from(this.plugins.values()).filter(p => p.status === 'active');
  }

  findTriggeredPlugins(input: string): ForgePlugin[] {
    const normalized = input.toLowerCase();
    return this.getActivePlugins().filter(p => 
      p.triggers.some(trigger => normalized.includes(trigger))
    );
  }

  togglePlugin(id: string) {
    const p = this.plugins.get(id);
    if (p) {
      p.status = p.status === 'active' ? 'disabled' : 'active';
    }
  }

  getAllPlugins(): ForgePlugin[] {
    return Array.from(this.plugins.values());
  }
}

export const pluginSystem = PluginSystem.getInstance();
