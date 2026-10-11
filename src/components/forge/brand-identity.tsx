"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Forge OS Brand Identity System
 * Provides scalable vector branding variants for the Sovereign Engineering Fabric.
 * PROPERTY OF VINEXSAH TECHNOLOGIES.
 */

interface BrandProps {
  className?: string;
  iconOnly?: boolean;
  monochrome?: boolean;
}

export function ForgeLogo({ className, iconOnly = false, monochrome = false }: BrandProps) {
  const colorClass = monochrome ? "fill-foreground" : "fill-primary";
  const glowClass = monochrome ? "" : "drop-shadow-[0_0_8px_rgba(255,107,0,0.5)]";

  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      {/* FORGE OS ICON: Stylized Anvil + Circuit Nodes */}
      <svg
        viewBox="0 0 100 100"
        className={cn("h-full w-auto", glowClass)}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className={colorClass}
          d="M20 30 L80 30 L85 45 L65 45 L65 70 L75 75 L75 85 L25 85 L25 75 L35 70 L35 45 L15 45 Z"
        />
        <circle cx="50" cy="40" r="4" className="fill-background" />
        <path
          className={colorClass}
          opacity="0.6"
          d="M50 44 L50 60 M40 50 L60 50"
          strokeWidth="2"
          stroke="currentColor"
        />
        <rect x="45" y="70" width="10" height="2" className="fill-background/40" />
      </svg>

      {!iconOnly && (
        <div className="flex flex-col">
          <span className={cn(
            "font-headline font-bold text-lg tracking-tighter uppercase italic leading-none",
            monochrome ? "text-foreground" : "text-primary"
          )}>
            Forge OS
          </span>
          <span className="text-[7px] font-headline text-muted-foreground uppercase tracking-[0.3em] mt-0.5">
            Sovereign Fabric
          </span>
        </div>
      )}
    </div>
  );
}

export function BrandCopyright() {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="text-[9px] font-headline uppercase text-foreground/80 font-bold tracking-widest">
        Forge OS
      </p>
      <p className="text-[7px] font-headline uppercase text-muted-foreground/40 tracking-[0.2em]">
        © 2026 VINEXSAH TECHNOLOGIES • ALL RIGHTS RESERVED
      </p>
    </div>
  );
}
