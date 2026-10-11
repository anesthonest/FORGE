/**
 * @fileOverview Forge OS Event-Driven Architecture Core (v3 - Unified persistent)
 * Enables decoupled communication and automated persistence of operational traces.
 * Property of VINEXSAH TECHNOLOGIES.
 */

import { logForgeEvent, type ForgeEventType } from "@/ai/core/event-logger";

export type ForgeEvent = 
  | 'wallet_updated' 
  | 'agent_executed' 
  | 'workflow_finished' 
  | 'deployment_completed' 
  | 'compliance_breach'
  | 'system_reboot'
  | 'marketplace_transaction'
  | 'identity_resolved';

type EventHandler = (data: any) => void;

class EventSystem {
  private static instance: EventSystem;
  private listeners: Map<ForgeEvent, Set<EventHandler>> = new Map();

  private constructor() {}

  static getInstance(): EventSystem {
    if (!EventSystem.instance) {
      EventSystem.instance = new EventSystem();
    }
    return EventSystem.instance;
  }

  /**
   * Subscribes to a platform-wide infrastructure event (UI only).
   */
  subscribe(event: ForgeEvent, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return () => this.unsubscribe(event, handler);
  }

  private unsubscribe(event: ForgeEvent, handler: EventHandler) {
    this.listeners.get(event)?.delete(handler);
  }

  /**
   * Dispatches an event across the mesh and triggers persistent logging.
   */
  dispatch(event: ForgeEvent, data: any, userId?: string) {
    console.info(`[FORGE-EVENTS] Dispatching: ${event.toUpperCase()}`);
    
    // 1. LOCAL DISPATCH (Reactive UI)
    this.listeners.get(event)?.forEach(handler => {
      try {
        handler(data);
      } catch (e) {
        console.error(`[FORGE-EVENTS-FAULT] Handler failed for ${event}:`, e);
      }
    });

    // 2. GLOBAL DISPATCH (Persistent Ledger)
    if (userId) {
      const typeMap: Record<ForgeEvent, ForgeEventType> = {
        'wallet_updated': 'wallet_transaction',
        'agent_executed': 'ai_execution',
        'workflow_finished': 'infra_heartbeat',
        'deployment_completed': 'infra_heartbeat',
        'compliance_breach': 'system_audit_event',
        'system_reboot': 'system_audit_event',
        'marketplace_transaction': 'marketplace_action',
        'identity_resolved': 'auth_action'
      };

      logForgeEvent({
        type: typeMap[event] || 'system_audit_event',
        userId,
        source: 'EventSystem_Core',
        action: event,
        metadata: data,
        status: 'success'
      });
    }
  }
}

export const eventSystem = EventSystem.getInstance();
