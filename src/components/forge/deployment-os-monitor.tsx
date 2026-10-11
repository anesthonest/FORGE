"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  Activity, 
  RefreshCcw, 
  ShieldCheck,
  Zap,
  Terminal,
  History,
  HeartPulse,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

const deploymentHistory = [
  { id: "DEP-901", version: "v1.4.3-AUTONOMOUS", status: "Stabilized", time: "Now", health: 99.9 },
  { id: "DEP-900", version: "v1.4.2-PRO", status: "Stabilized", time: "2h ago", health: 99.8 },
  { id: "DEP-899", version: "v1.4.1-BETA", status: "Rolled Back", time: "4h ago", health: 64.2 },
];

export function DeploymentOSMonitor() {
  const [canaryWeight, setCanaryWeight] = useState(15);
  const [isDeploying, setIsDeploying] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border border-l-4 border-l-primary/50 shadow-lg">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <Rocket className="h-4 w-4 text-primary" />
              <Badge variant="outline" className="text-[8px] h-4 font-headline uppercase text-primary border-primary/20">STABLE</Badge>
            </div>
            <CardTitle className="text-[10px] font-headline uppercase mt-3 tracking-widest text-muted-foreground">Production Version</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-headline font-bold">v1.4.3-STABLE</div>
            <p className="text-[9px] text-muted-foreground uppercase font-headline">Mesh Integrity: 99.9%</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="p-4">
            <HeartPulse className="h-4 w-4 text-green-500" />
            <CardTitle className="text-[10px] font-headline uppercase mt-3 tracking-widest text-muted-foreground">Cluster Health</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-headline font-bold text-green-500">NOMINAL</div>
            <p className="text-[9px] text-muted-foreground uppercase font-headline">All Regions Synced</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="p-4">
            <Zap className="h-4 w-4 text-orange-500" />
            <CardTitle className="text-[10px] font-headline uppercase mt-3 tracking-widest text-muted-foreground">Traffic Routing</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] font-headline">CANARY {canaryWeight}%</span>
              <span className="text-[8px] font-headline">STABLE {100 - canaryWeight}%</span>
            </div>
            <Progress value={canaryWeight} className="h-1 bg-muted" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="p-4">
            <ShieldCheck className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-[10px] font-headline uppercase mt-3 tracking-widest text-muted-foreground">Failsafe Control</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Button variant="outline" className="w-full h-8 text-[9px] font-headline uppercase border-blue-500/20 text-blue-500 hover:bg-blue-500/5">
              Force Rollback
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  Sovereign Release Audit
                </CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase">Automated Pipeline Verification</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-headline text-primary border-primary/20">AGENT: SENTINEL-PIPELINE</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { step: "LINT_VALIDATION", status: "Success", details: "0 style violations detected.", time: "5m ago" },
                { step: "TYPESCRIPT_AUDIT", status: "Success", details: "Type safety verified across project.", time: "4m ago" },
                { step: "AI_PREFLIGHT", status: "Success", details: "Architectural patterns approved.", time: "3m ago" },
                { step: "CANARY_PROMOTE", status: "Running", details: "Increasing canary weight to 25%.", time: "Now" },
              ].map((step, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded bg-black/30 border border-border/50 text-[10px] font-headline group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground w-12 opacity-50">{step.time}</span>
                    <span className="font-bold text-primary">{step.step}</span>
                    <span className="text-muted-foreground italic truncate max-w-[300px]">"{step.details}"</span>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[8px] h-4 uppercase",
                    step.status === 'Success' ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                    step.status === 'Running' ? "bg-primary/10 text-primary border-primary/20 animate-pulse" : 
                    "text-muted-foreground border-border/50"
                  )}>{step.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              Deployment Registry
            </CardTitle>
            <CardDescription className="text-[10px] font-headline uppercase">Immutable Build History</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deploymentHistory.map((h) => (
                <div key={h.id} className="p-3 rounded bg-muted/20 border border-border/30 group hover:border-primary/20 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-headline font-bold uppercase">{h.id}</span>
                    <Badge variant="outline" className={cn(
                      "text-[8px] h-4 uppercase",
                      h.status === 'Stabilized' ? "text-green-500 border-green-500/20" : "text-red-500 border-red-500/20"
                    )}>{h.status}</Badge>
                  </div>
                  <div className="flex justify-between text-[8px] font-headline text-muted-foreground uppercase">
                    <span>VER: {h.version}</span>
                    <span className={cn(h.health < 80 ? "text-red-500" : "text-primary")}>HEALTH: {h.health}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
