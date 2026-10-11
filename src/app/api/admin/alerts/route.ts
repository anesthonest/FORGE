import { APIEngine } from '@/lib/core/api-engine';
import { getServerFirebase } from '@/lib/firebase/server';

/**
 * @fileOverview Forge OS Alert Management API
 * Provides admin access to system incidents and resolution tracking.
 */

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const showResolved = searchParams.get('all') === 'true';

  return APIEngine.executeProtected('system-admin', async (db) => {
    let q = db.collection('alerts')
      .orderBy('timestamp', 'desc')
      .limit(50);

    if (!showResolved) {
      q = q.where('resolved', '==', false);
    }

    const snap = await q.get();
    const alerts = snap.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      time: doc.data().timestamp?.toDate()?.toISOString()
    }));

    return APIEngine.success(alerts);
  });
}

export async function PATCH(req: Request) {
  try {
    const { alertId, resolved = true } = await req.json();

    return APIEngine.executeProtected('system-admin', async (db) => {
      await db.collection('alerts').doc(alertId).update({
        resolved,
        resolvedAt: new Date().toISOString()
      });

      return APIEngine.success({ status: "STABILIZED" });
    });
  } catch (e: any) {
    return APIEngine.error(e.message);
  }
}
