import { NextResponse } from 'next/server';

/**
 * @fileOverview Redundant AI Gateway (DEPRECATED)
 * DEPRECATED: ALL TRAFFIC ROUTED TO /api/forge/run
 */

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json({ 
    success: false, 
    error: "GATEWAY_DEPRECATED: Use /api/forge/run for protected execution." 
  }, { status: 410 });
}
