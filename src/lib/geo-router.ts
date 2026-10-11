
/**
 * @fileOverview ForgeOS Multi-Region Geo-Router (Hyperscale v3)
 * Manages regional AI routing, data residency enforcement, and failover affinity.
 * PROPERTY OF VINEXSAH TECHNOLOGIES.
 */

export type RegionId = 'AF-01' | 'EU-01' | 'US-01' | 'AP-01' | 'ME-01';

export interface RegionalConfig {
  id: RegionId;
  name: string;
  compliance: string[];
  latencyPenalty: number;
  mode: 'VPC' | 'Sovereign' | 'Public' | 'Restricted';
  isScaleNode: boolean;
}

export const REGIONS: Record<RegionId, RegionalConfig> = {
  'AF-01': { id: 'AF-01', name: 'Africa (Edge)', compliance: ['POPIA', 'Sovereign'], latencyPenalty: 120, mode: 'VPC', isScaleNode: false },
  'EU-01': { id: 'EU-01', name: 'Europe (Compliance)', compliance: ['GDPR', 'Sovereign'], latencyPenalty: 35, mode: 'Sovereign', isScaleNode: false },
  'US-01': { id: 'US-01', name: 'US (Enterprise Scale)', compliance: ['FedRAMP', 'HIPAA'], latencyPenalty: 15, mode: 'Public', isScaleNode: true },
  'AP-01': { id: 'AP-01', name: 'Asia-Pacific (Scale)', compliance: ['Sovereign'], latencyPenalty: 65, mode: 'VPC', isScaleNode: false },
  'ME-01': { id: 'ME-01', name: 'Middle East (Gov)', compliance: ['Sovereign'], latencyPenalty: 42, mode: 'Restricted', isScaleNode: false },
};

export class GeoRouter {
  /**
   * Routes a request based on user region and data residency requirements.
   * Hyperscale Principle: Defaults to regional affinity, fails over to Scale Nodes.
   */
  static getOptimalRouting(userRegion: string = 'US-01', requiresResidency: boolean = true): RegionId {
    const normalized = userRegion.toUpperCase();
    const rid = (REGIONS[normalized as RegionId] ? normalized : 'US-01') as RegionId;
    const config = REGIONS[rid];

    // Sovereign Enforcement: If region is restricted, no failover allowed.
    if (requiresResidency && (config.mode === 'Sovereign' || config.mode === 'Restricted')) {
      return config.id;
    }
    
    // Load Balancing: If regional latency is too high, route to nearest Scale Node.
    if (config.latencyPenalty > 100 && !config.isScaleNode) {
       console.info(`[FORGE-GEO] Regional latency high. Rerouting to scale node.`);
       return 'US-01';
    }

    return config.id;
  }

  /**
   * Calculates the cross-region sync penalty.
   */
  static calculateHandshakeLatency(source: RegionId, target: RegionId): number {
    if (source === target) return REGIONS[source].latencyPenalty;
    return REGIONS[source].latencyPenalty + REGIONS[target].latencyPenalty;
  }

  /**
   * Validates if a cross-region data transfer is permitted by policy.
   */
  static isTransferPermitted(source: RegionId, target: RegionId): boolean {
    if (REGIONS[source].mode === 'Restricted' && source !== target) return false;
    if (REGIONS[source].mode === 'Sovereign' && REGIONS[target].mode === 'Public') return false;
    return true;
  }
}
