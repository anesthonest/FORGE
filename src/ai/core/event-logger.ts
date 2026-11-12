'use server';

import { getServerFirebase } from '@/lib/firebase/server';
import { AutonomousController } from './autonomous-controller';
import { alertEngine } from '@/lib/alerts/alert-engine';

/**
 * @fileOverview Forge OS Persistent Event Logger (Industrial Turbo v6)
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 * 
 * Strictly uses Firebase Admin SDK to enforce the Single Source of Truth ledger.
 * Instrumented for real-time live ops monitoring and autonomous alerting.
 */

export type ForgeEventType = 
  | 'auth_action'
  | 'ai_execution' 
  | 'wallet_transaction' 
  | 'subscription_update'
  | 'system_audit_event'
  | 'infra_heartbeat'
  | 'marketplace_action'
  | 'security_violation'
  | 'billing_action'
  | 'payment_success';

export interface ForgeEventPayload {
  type: ForgeEventType;
  userId: string;
  source: string;
  action: string;
  metadata: any;
  status?: 'success' | 'failed' | 'pending' | 'blocked';
  cost?: number;
  region?: string;
  valueImpact?: number;
  contributionScore?: number;
  resourceUsage?: number;
}

/**
 * Commits a high-integrity, validated event to the forge_events ledger.
 * Triggers the industrial live-ops observation cycle.
 */
export async function logForgeEvent(payload: ForgeEventPayload) {
  const { db, admin } = getServerFirebase();
  if (!db || !payload.userId) return;

  // 1. INPUT INTEGRITY CHECK
  if (!payload.type || !payload.action) {
    console.error("[FORGE-LEDGER-REJECT] Malformed event payload rejected.");
    return;
  }

  try {
    const eventsRef = db.collection('forge_events');
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    // 2. PERSIST TO IMMUTABLE LEDGER
    const docRef = await eventsRef.add({
      ...payload,
      uid: payload.userId,
      timestamp,
      verified: true,
      protocol_version: 'V6-LIVE-OPS',
      integrity_hash: Buffer.from(`${payload.userId}:${payload.type}:${Date.now()}`).toString('hex').slice(0, 32)
    });
    
    // 3. TRIGGER LIVE OPS OBSERVATION (Non-blocking)
    
    // A. Autonomous Reaction Pulse
    AutonomousController.processPulse(payload).catch(err => {
      console.error("[FORGE-AUTONOMY-FAULT] Reaction pulse failed:", err.message);
    });

    // B. Real-time Anomaly Detection (Alerting)
    alertEngine.analyzeEvent(payload, docRef.id).catch(err => {
       console.error("[FORGE-ALERT-FAULT] Anomaly detection deferred:", err.message);
    });

    // 4. SECURITY AUDIT MIRRORING (Redundant log for critical events)
    if (payload.type === 'security_violation' || payload.status === 'blocked' || payload.type === 'wallet_transaction') {
      await db.collection('audit_logs').add({
        uid: payload.userId,
        severity: payload.type === 'security_violation' ? 'EMERGENCY' : 'HIGH',
        event_ref: payload.action,
        timestamp,
        metadata: {
          ...payload.metadata,
          source: payload.source,
          eventId: docRef.id
        }
      });
    }

    console.info(`[FORGE-LEDGER] Event Pulse Recorded: ${payload.type} | ID: ${docRef.id.slice(0,8)}`);
  } catch (error) {
    console.warn("[FORGE-LEDGER-FAULT] Server persistence interrupt:", error);
  }
}
