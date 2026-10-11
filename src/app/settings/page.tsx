"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * @fileOverview Settings Redirect Handler
 * Ensures consistent routing to the dashboard's settings view.
 */

export default function SettingsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard with the settings view active
    router.replace("/?view=settings");
  }, [router]);

  return (
    <div className="h-screen w-full bg-background flex flex-col items-center justify-center gap-6 forge-grid">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center molten-glow animate-pulse">
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>
      <p className="text-[10px] text-muted-foreground uppercase font-headline tracking-[0.3em]">Routing Context...</p>
    </div>
  );
}
