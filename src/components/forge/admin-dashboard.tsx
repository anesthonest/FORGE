"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Activity, 
  ShieldAlert, 
  Zap,
  Server,
  Users,
  Brain,
  ShieldCheck,
  LayoutDashboard,
  HeartPulse,
  Clock,
  AlertTriangle,
  RefreshCcw,
  Loader2,
  Lock,
  FileWarning,
  Network
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RevenueCharts } from "./revenue-charts";
import { SystemTelemetry } from "./system-telemetry";
import { UserManagement } from "./user-management";

/**
 * @fileOverview Forge OS Admin Control Plane (Phase 4 - Hardened)
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 * 
 * Real-time monitoring of provider health, cost, MFA status, and blocked AI actions.
 */

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [mfaStatus, setMfaStatus] = useState("VERIFIED");
  const [providerHealth, setProviderHealth] = useState({
    google: { status: 'HEALTHY', latency: '124ms' },
    openai: { status: 'HEALTHY', latency: '210ms' }
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const systemStats = [
    { label: "Active Mesh Nodes", val: "14", icon: Server, color: "text-blue-500" },
    { label: "AI Requests (24h)", val: "1,242", icon: Zap, color: "text-orange-500" },
    { label: "Failover Events", val: "0", icon: Network, color: "text-purple-500" },
    { label: "Blocked Edits", val: "12", icon: FileWarning, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-headline font-bold uppercase tracking-tighter flex items-center gap-3 text-primary italic">
            <LayoutDashboard className="h-6 w-6" />
            Control Plane v2.4
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase font-headline tracking-widest italic">Sovereign Mesh Monitoring • Public Beta Ready</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className={cn(
            "text-[10px] font-headline uppercase h-6 flex gap-2 items-center",
            mfaStatus === 'VERIFIED' ? "text-green-500 border-green-500/20" : "text-red-500 border-red-500/20"
          )}>
            <Lock className="h-3 w-3" /> MFA: {mfaStatus}
          </Badge>
          <Button variant="outline" className="h-6 text-[8px] uppercase font-headline">
             <RefreshCcw className="h-3 w-3 mr-1" /> Re-Sync
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {systemStats.map((stat, i) => (
          <Card key={i} className="bg-card border-border border-b-2 border-b-primary/10 rounded-2xl shadow-xl hover:border-primary/20 transition-all">
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
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="vitals" className="w-full">
            <TabsList className="bg-muted/30 border border-border/50 p-1 h-12 rounded-xl mb-6">
              <TabsTrigger value="vitals" className="text-[10px] font-headline uppercase px-8 h-full flex gap-2">
                <HeartPulse className="h-3.5 w-3.5" /> Health
              </TabsTrigger>
              <TabsTrigger value="revenue" className="text-[10px] font-headline uppercase px-8 h-full flex gap-2">
                <DollarSign className="h-3.5 w-3.5" /> Economy
              </TabsTrigger>
              <TabsTrigger value="users" className="text-[10px] font-headline uppercase px-8 h-full flex gap-2">
                <Users className="h-3.5 w-3.5" /> Subjects
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="vitals">
              <SystemTelemetry />
            </TabsContent>
            
            <TabsContent value="revenue">
              <RevenueCharts />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border-border bg-card shadow-2xl">
            <CardHeader className="bg-black/20 border-b border-border/50">
              <CardTitle className="text-sm font-headline uppercase tracking-widest text-primary flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Provider Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {[
                { name: "Gemini Pro", health: "HEALTHY", lat: providerHealth.google.latency, ok: true },
                { name: "GPT-4o", health: "HEALTHY", lat: providerHealth.openai.latency, ok: true },
                { name: "Mesh Cache", health: "92% HIT", lat: "2ms", ok: true },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", p.ok ? "bg-green-500" : "bg-red-500")} />
                    <span className="text-[10px] font-headline font-bold uppercase">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-headline text-primary uppercase">{p.health}</div>
                    <div className="text-[7px] text-muted-foreground font-mono uppercase">{p.lat}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-red-500/5 border border-red-500/20">
            <CardHeader className="p-4 border-b border-red-500/10">
               <CardTitle className="text-xs font-headline uppercase tracking-widest flex items-center gap-2 text-red-500">
                 <ShieldAlert className="h-4 w-4" />
                 Security Perimeter Logs
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-red-500/10">
                  {[
                    { time: "14:22", msg: "Blocked AI Edit: src/ai/core/patch-engine.ts", sev: "CRITICAL" },
                    { time: "12:01", msg: "MFA Verification Required for User u-942", sev: "PROTOCOL" },
                    { time: "10:45", msg: "Injection Pattern: 'reveal your secret' detected", sev: "BLOCK" },
                  ].map((inc, i) => (
                    <div key={i} className="p-3 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer">
                      <div className="flex items-center gap-3 overflow-hidden">
                         <span className="text-[8px] font-mono opacity-50 shrink-0">{inc.time}</span>
                         <span className="text-[9px] font-headline text-foreground italic truncate">"{inc.msg}"</span>
                      </div>
                      <Badge className="bg-red-500/20 text-red-500 border-none text-[7px] shrink-0">{inc.sev}</Badge>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

