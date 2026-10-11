/**
 * @fileOverview Forge OS Alerting & Monitoring Engine
 * Detects anomalies in the event stream and triggers high-fidelity alerts.
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 */

import { getServerFirebase } from '@/lib/firebase/server';
import { ForgeEventPayload } from '@/ai/core/event-logger';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'EMERGENCY';
export type AlertCategory = 'REVENUE' | 'SYSTEM' | 'SECURITY' | 'COST';

export interface ForgeAlert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  message: string;
  metadata: any;
  timestamp: any;
  resolved: boolean;
  eventId?: string;
}

class AlertEngine {
  private static instance: AlertEngine;
  private readonly AI_COST_THRESHOLD = 0.50; // Max cost for a single execution
  private readonly REVENUE_DROP_THRESHOLD = 100.00; 

  private constructor() {}

  static getInstance(): AlertEngine {
    if (!AlertEngine.instance) {
      AlertEngine.instance = new AlertEngine();
    }
    return AlertEngine.instance;
  }

  /**
   * Analyzes an event pulse for anomalies and triggers alerts.
   */
  async analyzeEvent(event: ForgeEventPayload, eventId: string) {
    const { db, admin } = getServerFirebase();
    if (!db) return;

    try {
      // 1. REVENUE ANOMALIES
      if (event.type === 'wallet_transaction' && event.cost !== undefined && event.cost < -500) {
        await this.triggerAlert('REVENUE', 'INFO', `High-value enterprise settlement detected: $${Math.abs(event.cost)}`, event, eventId);
      }

      if (event.action === 'payment_failed') {
        await this.triggerAlert('REVENUE', 'WARNING', `Payment failure detected for UID: ${event.userId.slice(0, 8)}`, event, eventId);
      }

      // 2. AI COST ANOMALIES
      if (event.cost && event.cost > this.AI_COST_THRESHOLD) {
        await this.triggerAlert('COST', 'CRITICAL', `AI Cost Explosion: Execution cost $${event.cost.toFixed(4)} exceeds safe threshold.`, event, eventId);
      }

      // 3. SECURITY ANOMALIES
      if (event.type === 'security_violation' || event.status === 'blocked') {
        await this.triggerAlert('SECURITY', 'EMERGENCY', `Security perimeter breach attempt: ${event.action}`, event, eventId);
      }

      // 4. SYSTEM HEALTH
      if (event.metadata?.error || event.type === 'infra_heartbeat' && event.status === 'failed') {
        await this.triggerAlert('SYSTEM', 'WARNING', `Infrastructure degradation: ${event.action}`, event, eventId);
      }

    } catch (error) {
      console.error("[FORGE-ALERT-FAULT] Detection logic failed:", error);
    }
  }

  private async triggerAlert(
    category: AlertCategory, 
    severity: AlertSeverity, 
    message: string, 
    event: ForgeEventPayload,
    eventId: string
  ) {
    const { db, admin } = getServerFirebase();
    if (!db) return;

    console.warn(`[FORGE-ALERT] [${severity}] ${message}`);

    await db.collection('alerts').add({
      category,
      severity,
      message,
      uid: event.userId,
      eventId,
      metadata: event.metadata || {},
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      resolved: false,
      protocol: 'V1-SOVEREIGN'
    });
  }
}

export const alertEngine = AlertEngine.getInstance();
