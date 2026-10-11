import { NextResponse } from 'next/server';
import { MarketplaceEngine } from '@/lib/marketplace-engine';

/**
 * @fileOverview Forge OS Marketplace Transaction Gateway
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 */

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { userId, itemId } = await req.json();

    if (!userId || !itemId) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const result = await MarketplaceEngine.purchaseItem(userId, itemId);

    return NextResponse.json({
      success: true,
      status: "completed",
      data: result,
      error: null
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: "failed",
      error: { message: error.message, code: "TRANSACTION_FAULT" }
    }, { status: 500 });
  }
}
