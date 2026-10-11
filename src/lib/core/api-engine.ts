import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerFirebase } from "@/lib/firebase/server";

/**
 * @fileOverview Forge OS Industrial API Engine (Hardened v3)
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 * 
 * Enforces Zero-Trust execution boundaries and Authoritative State resolution.
 */

export interface APIResponse<T = any> {
  success: boolean;
  status: "completed" | "failed" | "pending" | "blocked";
  data: T | null;
  error: {
    message: string;
    code: string;
  } | null;
}

export class APIEngine {
  /**
   * Generates a production-safe success response.
   */
  static success<T>(data: T, status: APIResponse["status"] = "completed"): NextResponse<APIResponse<T>> {
    return NextResponse.json({
      success: true,
      status,
      data,
      error: null,
    });
  }

  /**
   * Generates a production-safe error response.
   * Redacts sensitive infrastructure details to prevent fingerprinting.
   */
  static error(message: string, code: string = "CORE_FAULT", status: number = 500): NextResponse<APIResponse> {
    const isProd = process.env.NODE_ENV === 'production';
    const safeMessage = isProd && status === 500 ? "Internal Mesh Interrupt. Request logged." : message;
    
    return NextResponse.json({
      success: false,
      status: "failed",
      data: null,
      error: { message: safeMessage, code },
    }, { status });
  }

  /**
   * Validates incoming request payloads against Zod schemas.
   */
  static async validate<T>(req: Request, schema: z.Schema<T>): Promise<{ data: T | null; error?: string }> {
    try {
      const body = await req.json();
      const result = schema.safeParse(body);
      if (!result.success) {
        return { data: null, error: result.error.errors.map(e => e.message).join(", ") };
      }
      return { data: result.data };
    } catch (e) {
      return { data: null, error: "Malformed request payload." };
    }
  }

  /**
   * Enforces protected execution boundaries for authenticated mesh tenants.
   * Performs real-time Authoritative State verification (Zero-Trust).
   */
  static async executeProtected(
    userId: string | undefined, 
    handler: (db: any, admin: any, userProfile: any) => Promise<NextResponse>
  ): Promise<NextResponse> {
    if (!userId) {
      return this.error("Unauthorized mesh access. Provisioning required.", "AUTH_DENIED", 401);
    }

    try {
      const { db, admin } = getServerFirebase();
      if (!db) return this.error("Infrastructure Offline", "DB_ERROR");

      // 1. Resolve Authoritative Operator State from Firestore (Server-Side Only)
      const userRef = db.collection("users").doc(userId);
      const userSnap = await userRef.get();
      
      if (!userSnap.exists) {
        return this.error("Operator Identity Not Provisioned.", "AUTH_DENIED", 403);
      }

      const userProfile = userSnap.data();
      if (!userProfile) {
        return this.error("Operator Identity Not Provisioned.", "AUTH_DENIED", 403);
      }

      // 2. Prevent Access for Suspended/Inactive Accounts
      if (userProfile.subscriptionStatus === 'suspended') {
         return this.error("Identity Suspended. Contact System Administrator.", "AUTH_SUSPENDED", 403);
      }
      
      // 3. High-Integrity Security Audit
      await db.collection('audit_logs').add({
        uid: userId,
        action: 'API_PROTECTED_EXECUTION',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        status: 'authorized',
        metadata: {
          path: 'execution_boundary',
          role: userProfile.role || 'user',
          tier: userProfile.plan || 'free'
        }
      });

      return await handler(db, admin, userProfile);
    } catch (e: any) {
      console.error("[FORGE-API-CRASH]", e);
      return this.error("Execution Interrupt. Integrity check failed.", "RUNTIME_FAULT");
    }
  }
}