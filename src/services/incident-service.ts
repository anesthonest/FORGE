'use server';

/**
 * @fileOverview Forge OS Production Incident Management Service
 * Tracks, logs, and manages the lifecycle of infrastructure incidents.
 */

import { getServerFirebase } from '@/lib/firebase/server';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'MONITORING';

export interface IncidentReport {
  id?: string;
  timestamp: any;
  severity: IncidentSeverity;
  service: string;
  description: string;
  status: IncidentStatus;
  resolution?: string;
  metadata?: any;
}

/**
 * Logs a new infrastructure incident to the sovereign ledger.
 */
export async function reportIncident(report: Omit<IncidentReport, 'timestamp' | 'status'>) {
  const { db, admin } = getServerFirebase();
  if (!db) return;

  try {
    const incidentRef = db.collection('incident_reports');
    await incidentRef.add({
      ...report,
      status: 'OPEN',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.info(`[FORGE-OPS] Incident Reported: ${report.service} - ${report.severity}`);
  } catch (error: any) {
    console.error("[FORGE-OPS-FAULT] Incident logging failed:", error.message);
  }
}

/**
 * Updates an incident's status or adds a resolution.
 */
export async function updateIncident(incidentId: string, update: Partial<IncidentReport>) {
  const { db } = getServerFirebase();
  if (!db) return;

  await db.collection('incident_reports').doc(incidentId).update(update);
}

/**
 * Retrieves recent incidents for the monitoring dashboard.
 */
export async function getRecentIncidents(limitCount: number = 10) {
  const { db } = getServerFirebase();
  if (!db) return [];

  const snap = await db.collection('incident_reports')
    .orderBy('timestamp', 'desc')
    .limit(limitCount)
    .get();

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    time: doc.data().timestamp?.toDate()?.toISOString()
  }));
}
