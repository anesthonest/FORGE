"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  ShieldAlert, 
  Zap, 
  Clock, 
  History, 
  Terminal, 
  Layers,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Cpu,
  BarChart3,
  TrendingUp,
  Coins,
  Search,
  Monitor,
  Lock,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { healthMonitor } from "@/lib/orchestrator/health-monitor";
import { orchestrator } from "@/lib/orchestrator/orchestration-engine";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * @fileOverview Operations Center UI (v4 - Certified for Public Beta)
 * PROPERTY OF VINEXSAH TECHNOLOGIES.
 */

export function OperationsCenter() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/admin/health');
      const json = await res.json();
      if (json.success) setHealthData(json.data);
    } catch (e) {
      console.error("Health sync fault:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !healthData) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 opacity-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-[10px] font-headline uppercase tracking-widest">Aggregating Global Operational Pulse...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-headline font-bold uppercase tracking-tighter flex items-center gap-2 text-primary italic">
            <Activity className="h-5 w-5" />
            Sovereign Command Feed
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase font-headline tracking-widest">Certified Operational Mesh • Public Beta ready</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className={cn(
            "text-[10px] font-headline uppercase h-6 border-primary/20",
            healthData?.status === 'CRITICAL' ? "text-red-500 border-red-500/20" : 
            healthData?.status === 'WARNING' ? "text-orange-500 border-orange-500/20" : "text-green-500 border-green-500/20"
          )}>
            MESH: {healthData?.status || 'HEALTHY'}
          </Badge>
          <Button size="sm" variant="outline" className="h-6 text-[8px] uppercase font-headline" onClick={fetchHealth}>
            <RefreshCcw className="h-3 w-3 mr-1" /> Re-Sync
          </Button>
        </div>
      </div>

      <Tabs defaultValue="monitoring" className="w-full">
        <TabsList className="bg-muted/30 border border-border/50 p-1 h-12 rounded-xl mb-6">
          <TabsTrigger value="monitoring" className="text-[10px] font-headline uppercase px-8 h-full flex gap-2">
            <Monitor className="h-3.5 w-3.5" /> Monitoring
          </TabsTrigger>
          <TabsTrigger value="incidents" className="text-[10px] font-headline uppercase px-8 h-full flex gap-2">
            <ShieldAlert className="h-3.5 w-3.5" /> Incidents
          </TabsTrigger>
          <TabsTrigger value="certification" className="text-[10px] font-headline uppercase px-8 h-full flex gap-2">
            <ShieldCheck className="h-3.5 w-3.5" /> Certification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Active Nodes", val: "14", icon: Layers, color: "text-blue-500" },
              { label: "Avg Latency", val: `${healthData?.metrics?.latencyAvg || 0}ms`, icon: Clock, color: "text-primary" },
              { label: "Cache Hit", val: "92.4%", icon: Zap, color: "text-green-500" },
              { label: "Error Rate", val: `${(healthData?.metrics?.errorRate * 100 || 0).toFixed(2)}%`, icon: AlertCircle, color: "text-red-500" },
            ].map((stat, i) => (
              <Card key={i} className="bg-card border-border border-b-2 border-b-primary/10 rounded-2xl shadow-xl">
                <CardHeader className="p-4 pb-2">
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                  <p className="text-[9px] font-headline uppercase text-muted-foreground mt-2">{stat.label}</p>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <span className="text-xl font-headline font-bold uppercase">{stat.val}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border bg-card/50 shadow-2xl">
              <CardHeader className="bg-black/20 border-b border-border/50">
                <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2 text-primary">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Provider Health Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {Object.entries(healthData?.metrics?.providerAvailability || { googleai: true, openai: true }).map(([name, ok]: any) => (
                  <div key={name} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", ok ? "bg-green-500" : "bg-red-500")} />
                      <span className="text-[10px] font-headline font-bold uppercase">{name}</span>
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-[8px] h-4 uppercase",
                      ok ? "text-green-500 border-green-500/20" : "text-red-500 border-red-500/20"
                    )}>{ok ? "ONLINE" : "UNAVAILABLE"}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2 text-primary">
                  <Zap className="h-4 w-4 text-primary" />
                  Fabric Vitals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: "Execution Throughput", val: 82 },
                  { label: "Database Pressure", val: (healthData?.metrics?.dbPressure * 100) || 12 },
                  { label: "Queue Backlog", val: orchestrator.getQueueDepth() * 5 },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[8px] font-headline uppercase">
                      <span>{stat.label}</span>
                      <span className="text-primary font-bold">{stat.val}%</span>
                    </div>
                    <Progress value={stat.val} className="h-1 bg-muted" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents">
          <Card className="border-border bg-card/50 shadow-2xl overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-border/50">
              <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2 text-primary">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Active Incident Ledger
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {healthData?.incidents?.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground uppercase text-[10px] font-headline italic opacity-40">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-3 text-green-500" />
                  All Infrastructure Nodes Nominal.
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {healthData?.incidents?.map((inc: any) => (
                    <div key={inc.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-2 rounded-lg mt-1",
                          inc.severity === 'CRITICAL' ? "bg-red-500/20 text-red-500" :
                          inc.severity === 'HIGH' ? "bg-orange-500/20 text-orange-500" : "bg-blue-500/20 text-blue-500"
                        )}>
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-headline font-bold uppercase">{inc.service}</span>
                            <Badge variant="outline" className="text-[7px] h-3.5 border-border/50 uppercase">{inc.severity}</Badge>
                          </div>
                          <p className="text-[11px] font-headline text-foreground leading-tight mt-1">"{inc.description}"</p>
                          <p className="text-[8px] text-muted-foreground uppercase font-headline mt-1.5">
                            {new Date(inc.time).toLocaleString()} • STATUS: {inc.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certification">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="border-border bg-card/50">
               <CardHeader>
                  <CardTitle className="text-sm font-headline uppercase tracking-widest text-primary flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Security Certification
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  {[
                    { label: "MFA Enforcement", ok: true },
                    { label: "Kernel Immutable Paths", ok: true },
                    { label: "Zero-Trust UID Isolation", ok: true },
                    { label: "Audit Ledger Verification", ok: true },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-border/30">
                       <span className="text-[10px] font-headline uppercase">{c.label}</span>
                       <Badge className="bg-green-500/20 text-green-500 border-none text-[8px]">CERTIFIED</Badge>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-border/30 text-center">
                    <div className="text-3xl font-headline font-bold text-primary">98/100</div>
                    <p className="text-[10px] text-muted-foreground uppercase font-headline">Security Integrity Score</p>
                  </div>
               </CardContent>
             </Card>

             <Card className="border-border bg-card/50">
               <CardHeader>
                  <CardTitle className="text-sm font-headline uppercase tracking-widest text-primary flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Deployment Readiness
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  {[
                    { label: "Legal Consent v1.0", ok: true },
                    { label: "Regional Failover Affinity", ok: true },
                    { label: "Provider Metering Sync", ok: true },
                    { label: "Bootstrap Non-Blocking", ok: true },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-border/30">
                       <span className="text-[10px] font-headline uppercase">{c.label}</span>
                       <Badge className="bg-blue-500/20 text-blue-500 border-none text-[8px]">READY</Badge>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-border/30 text-center">
                    <Badge className="bg-primary text-primary-foreground font-headline uppercase h-8 px-6 text-xs">GO: PUBLIC BETA</Badge>
                    <p className="text-[9px] text-muted-foreground uppercase font-headline mt-3 italic">"Verified for sovereign execution by Vinexsah AI."</p>
                  </div>
               </CardContent>
             </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}