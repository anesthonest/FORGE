"use client";

import React from "react";
import { useForgeRuntime } from "@/context/forge-runtime-context";
import { Loader2, ShieldCheck, Cpu } from "lucide-react";
import { BootstrapEngine } from "@/lib/bootstrap/bootstrap-engine";
import { ForgeLogo } from "./brand-identity";

/**
 * @fileOverview Forge OS Non-Blocking Hydration Gate
 * Ensures core authority resolves without blocking the shell for background syncs.
 */

export function HydrationGate({ children }: { children: React.ReactNode }) {
  const { bootStage } = useForgeRuntime();

  // Optimized Gate: Only block rendering during early auth resolution.
  // Session loading and mesh activation happen within the usable shell.
  const isBlocking = bootStage === 'UI_SHELL' || bootStage === 'AUTH_RESOLVE';

  if (isBlocking) {
    return (
      <div className="h-screen w-full bg-background flex flex-col items-center justify-center gap-8 forge-grid relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
           <div className="w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <ForgeLogo iconOnly className="h-24 w-24 animate-pulse" />

          <div className="space-y-4">
            <h1 className="text-3xl font-headline font-bold uppercase italic tracking-tighter text-foreground">
              Forge OS
            </h1>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-muted/40 border border-border/50 min-w-[240px] justify-center">
                 <Loader2 className="h-4 w-4 animate-spin text-primary" />
                 <span className="text-[10px] font-headline text-primary uppercase font-bold tracking-widest">
                   {BootstrapEngine.getStageDescription(bootStage)}
                 </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 flex flex-col items-center gap-3 opacity-40">
          <div className="flex items-center gap-4 text-[8px] font-headline text-muted-foreground uppercase tracking-[0.4em]">
            <ShieldCheck className="h-3 w-3" />
            Sovereign Fabrication Runtime
            <Cpu className="h-3 w-3" />
          </div>
          <p className="text-[7px] font-headline uppercase text-muted-foreground tracking-widest">
             Forge OS © 2026 VINEXSAH TECHNOLOGIES
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
