import fs from "fs/promises";
import path from "path";
import { logForgeEvent } from "./event-logger";

/**
 * @fileOverview ForgeOS Sovereign Patch Engine (Hardened v14)
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 * 
 * Provides deterministic filesystem remediation with absolute allowlist enforcement.
 * Blocks all AI-driven edits to core system paths.
 */

const ALLOWED_ROOTS = [
  "workspaces",
  "user-content",
  "generated-assets",
  "docs",
  "src/app/workspaces"
];

const FORBIDDEN_ROOTS = [
  "src/ai/core",
  "src/ai/providers",
  "src/firebase",
  "src/lib/firebase",
  ".env",
  "apphosting.yaml"
];

/**
 * Validates if a target path is safe for AI-driven modification.
 */
function isPathSafe(filePath: string): boolean {
  const normalized = path.normalize(filePath).replace(/\\/g, '/');
  
  // 1. Block core system paths
  if (FORBIDDEN_ROOTS.some(f => normalized.includes(f) || normalized === f)) {
    return false;
  }

  // 2. Allow only explicitly whitelisted paths
  return ALLOWED_ROOTS.some(a => normalized.startsWith(a));
}

/**
 * Applies a deterministic code patch to a specific file within the mesh.
 */
export async function applyPatch(filePath: string, content: string, userId: string = "system-agent") {
  const safe = isPathSafe(filePath);

  // LOG ATTEMPT TO AUDIT LEDGER
  await logForgeEvent({
    type: 'system_audit_event',
    userId,
    source: 'Sovereign_Patch_Engine',
    action: 'AI_FILE_MODIFICATION_ATTEMPT',
    status: safe ? 'success' : 'blocked',
    metadata: { filePath, safe }
  });

  if (!safe) {
    console.error(`[FORGE-SECURITY] Blocked AI modification attempt on protected path: ${filePath}`);
    throw new Error(`SECURITY_VIOLATION: Direct modification of core path ${filePath} is forbidden.`);
  }

  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    
    await fs.writeFile(fullPath, content, "utf-8");

    return {
      success: true,
      file: filePath,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error(`[FORGE-PATCH-FAULT] Failed to apply patch to ${filePath}:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Reads the content of a project file for context gathering or audit.
 */
export async function readProjectFile(filePath: string) {
  try {
    return await fs.readFile(path.join(process.cwd(), filePath), "utf-8");
  } catch (error: any) {
    console.error(`[FORGE-PATCH-FAULT] Failed to read file ${filePath}:`, error.message);
    throw error;
  }
}
