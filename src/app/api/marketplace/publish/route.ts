import { NextResponse } from 'next/server';
import { MarketplaceEngine } from '@/lib/marketplace-engine';

/**
 * @fileOverview Forge OS Marketplace Publishing Gateway
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 */

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { userId, item } = await req.json();

    if (!userId || !item) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const itemId = await MarketplaceEngine.publishItem(userId, item);

    return NextResponse.json({
      success: true,
      status: "completed",
      data: { itemId },
      error: null
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      status: "failed",
      error: { message: error.message, code: "PUBLISH_FAULT" }
    }, { status: 500 });
  }
}
