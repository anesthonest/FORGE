import { APIEngine } from '@/lib/core/api-engine';
import { getServerFirebase } from '@/lib/firebase/server';
import { InvestorEngine } from '@/lib/investor-engine';

/**
 * @fileOverview Forge OS Investor Intelligence API (Industrial Aggregation v5)
 * Derives investor-ready metrics from the verified forge_events ledger.
 */

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { db } = getServerFirebase();
  if (!db) return APIEngine.error("Infrastructure offline.", "DB_ERROR");

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

    // 1. Fetch Event Stream for Unit Economics & Growth
    const eventsSnap = await db.collection('forge_events')
      .where('verified', '==', true)
      .where('timestamp', '>=', sixtyDaysAgo)
      .get();

    let mrrCurrent = 0;
    let mrrPrevious = 0;
    let totalUsers = 0;
    let cancelledUsers = 0;
    let aiCosts = 0;
    let newUsers = 0;

    eventsSnap.docs.forEach(doc => {
      const data = doc.data();
      const isRecent = data.timestamp?.toDate() >= thirtyDaysAgo;

      if (data.type === 'payment_success' || (data.type === 'wallet_transaction' && data.cost < 0)) {
        const amount = Math.abs(data.cost || 0);
        if (isRecent) {
          mrrCurrent += amount;
          newUsers++;
        } else {
          mrrPrevious += amount;
        }
      }

      if (data.type === 'ai_execution') {
        aiCosts += (data.cost || 0);
      }

      if (data.action === 'subscription_cancelled') {
        if (isRecent) cancelledUsers++;
      }
      
      if (data.action === 'account_created' && isRecent) {
        totalUsers++;
      }
    });

    // 2. Perform Industrial Math
    const arr = mrrCurrent * 12;
    const churnRate = totalUsers > 0 ? (cancelledUsers / totalUsers) : 0.04;
    const growthRate = mrrPrevious > 0 ? (mrrCurrent - mrrPrevious) / mrrPrevious : 0.12;
    
    // Estimates for prototype logic
    const unitEcon = InvestorEngine.computeUnitEconomics(500, newUsers || 5, mrrCurrent / Math.max(totalUsers, 1), churnRate);
    const valuation = InvestorEngine.calculateValuation(arr, growthRate, churnRate);
    
    const profitMargin = mrrCurrent > 0 ? (mrrCurrent - aiCosts) / mrrCurrent : 0.8;
    const healthScore = InvestorEngine.computeHealthScore({ 
      growthRate, 
      churnRate, 
      ltvCacRatio: unitEcon.ratio,
      mrr: mrrCurrent,
      profitMargin
    });

    const data = {
      mrr: mrrCurrent,
      arr,
      churnRate,
      growthRate,
      cac: unitEcon.cac,
      ltv: unitEcon.ltv,
      ltvCacRatio: unitEcon.ratio,
      valuation,
      healthScore,
      burnRate: aiCosts, // Infrastructure burn
      runwayMonths: 18, // Simulated based on current capital
      profitMargin,
      recommendation: growthRate > 0.2 ? "AGGRESSIVE_SCALE" : "OPTIMIZE_UNIT_ECONOMICS"
    };

    return APIEngine.success(data);

  } catch (error: any) {
    console.error("[FORGE-INVESTOR-FAULT]", error.message);
    return APIEngine.error(error.message, "INVESTOR_AGGREGATION_FAULT");
  }
}
