
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Server, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Lock,
  Cloud,
  MapPin,
  Rocket,
  Share2,
  RefreshCcw,
  Binary,
  Cpu,
  Network,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { REGIONS, RegionId } from "@/lib/geo-router";
import { orchestrator } from "@/lib/orchestrator/orchestration-engine";

/**
 * @fileOverview Global Infrastructure Dashboard (Distributed Mesh v2)
 * Visualizes the sovereign node topology and regional workloads.
 */

export function GlobalInfrastructure() {
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [syncFidelity, setSyncFidelity] = useState(99.9);
  const [regionalLoads, setRegionalLoads] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate dynamic load sampling
      const nextLoads: Record<string, number> = {};
      Object.keys(REGIONS).forEach(rid => {
        nextLoads[rid] = Math.floor(Math.random() * 40) + 10;
      });
      setRegionalLoads(nextLoads);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerProvisioning = () => {
    setIsProvisioning(true);
    setTimeout(() => setIsProvisioning(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-headline font-bold uppercase tracking-tighter flex items-center gap-2 text-primary">
            <Share2 className="h-5 w-5" />
            Distributed Sovereign AI Mesh
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase font-headline tracking-widest italic">Multi-Region Intelligence Fabric & Global Execution Control</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={triggerProvisioning} 
            disabled={isProvisioning}
            className="font-headline text-[10px] uppercase h-9 molten-glow flex items-center gap-2"
          >
            {isProvisioning ? (
              <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Rocket className="h-3.5 w-3.5" />
            )}
            {isProvisioning ? "SYNCING FABRIC..." : "SYNCHRONIZE GLOBAL NODES"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Mesh Integrity", val: `${syncFidelity}%`, icon: ShieldCheck, color: "text-green-500" },
          { label: "Active Global Nodes", val: Object.keys(REGIONS).length.toString(), icon: Server, color: "text-primary" },
          { label: "Intelligence Sync", val: "High Fidelity", icon: Binary, color: "text-blue-500" },
          { label: "Isolation Guard", val: "Layer 3 Active", icon: Lock, color: "text-red-500" },
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border border-b-2 border-b-primary/20">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <stat.icon className={cn("h-4 w-4", stat.color)} />
                <Badge variant="secondary" className="text-[7px] h-3.5 uppercase font-headline">GLOBAL</Badge>
              </div>
              <p className="text-[9px] font-headline uppercase text-muted-foreground mt-2">{stat.label}</p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <span className="text-xl font-headline font-bold uppercase">{stat.val}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border bg-card/50">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Regional Node Topology
                </CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase">DECENTRALIZED WORKLOAD DISTRIBUTION</CardDescription>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] font-headline text-green-500 font-bold">FABRIC NOMINAL</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/30">
              {Object.values(REGIONS).map((region) => (
                <div key={region.id} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-lg bg-muted transition-colors",
                      regionalLoads[region.id] > 40 ? "text-orange-500" : "text-primary"
                    )}>
                      <Cloud className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-headline font-bold uppercase">{region.name}</span>
                        <Badge variant="outline" className="text-[7px] h-3.5 px-1 font-headline uppercase opacity-70">{region.mode}</Badge>
                      </div>
                      <div className="text-[9px] text-muted-foreground font-headline uppercase flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span>LATENCY: {region.latencyPenalty}ms</span>
                        <span className="text-primary font-bold">QUEUED: {orchestrator.getRegionalTasks(region.id as RegionId).length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right w-24 hidden md:block">
                      <div className="flex justify-between text-[8px] font-headline uppercase mb-1">
                        <span>Local Load</span>
                        <span>{regionalLoads[region.id] || 0}%</span>
                      </div>
                      <Progress value={regionalLoads[region.id] || 0} className="h-1 bg-muted" />
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-[8px] font-headline uppercase border-border/50 group-hover:border-primary/50">
                      View Node
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Live Mesh Sync
            </CardTitle>
            <CardDescription className="text-[10px] font-headline uppercase">CROSS-REGION DATA REPLICATION</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[
                { label: "US-01 -> EU-01", status: "Synced", ok: true },
                { label: "AF-01 -> US-01", status: "Synced", ok: true },
                { label: "ME-01 -> EU-01", status: "Restricted", ok: false },
                { label: "AP-01 -> US-01", status: "Syncing", ok: true, pulse: true },
              ].map((sync, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Activity className={cn("h-4 w-4", sync.ok ? "text-green-500" : "text-red-500", sync.pulse && "animate-pulse")} />
                    <span className="text-[10px] font-headline uppercase font-bold text-muted-foreground">{sync.label}</span>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[8px] h-4 uppercase border-none",
                    sync.ok ? "text-green-500" : "text-red-500"
                  )}>{sync.status}</Badge>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border/30">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                 <h4 className="text-[9px] font-headline font-bold uppercase text-primary flex items-center gap-2">
                   <ShieldAlert className="h-3 w-3" />
                   Sovereign Integrity Guard
                 </h4>
                 <p className="text-[9px] text-muted-foreground uppercase leading-tight italic">
                   "Middle East Gov node (ME-01) is operating in Restricted mode. Cross-region inference is prohibited by Sovereign policy L3."
                 </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
