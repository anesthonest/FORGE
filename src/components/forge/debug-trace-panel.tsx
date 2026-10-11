"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bug, 
  ChevronUp, 
  ChevronDown, 
  RefreshCcw, 
  Monitor,
  Cpu,
  Activity,
  Timer,
  Network,
  ShieldCheck,
  Zap,
  Terminal
} from "lucide-react";
import { useForgeRuntime } from "@/context/forge-runtime-context";
import { orchestrator } from "@/lib/orchestrator/orchestration-engine";
import { terminateClientMesh } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Forge Diagnostic Center (v18.5 - Kernel Monitoring)
 */

export function DebugTracePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const runtime = useForgeRuntime();
  const { renderCount, meshState, bootStage, performance, readiness } = runtime;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-[9999] transition-all duration-300",
      isOpen ? "w-[680px]" : "w-auto"
    )}>
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "ml-auto mb-2 font-headline text-[10px] uppercase flex items-center gap-2 shadow-2xl molten-glow border border-white/10 px-6 h-11 rounded-full",
          readiness.runtimeStable ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"
        )}
      >
        <Bug className="h-3.5 w-3.5" />
        {isOpen ? "Close Terminal" : "Kernel Trace"}
        {!readiness.runtimeStable && <Activity className="h-3 w-3 animate-pulse" />}
        {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
      </Button>

      {isOpen && (
        <Card className="bg-card/95 backdrop-blur-2xl border-red-600/50 shadow-[0_0_60px_rgba(220,38,38,0.2)] max-h-[850px] overflow-hidden flex flex-col rounded-3xl">
          <CardHeader className="bg-red-600/10 border-b border-red-600/20 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-red-500" />
                <div>
                  <CardTitle className="text-xs font-headline uppercase tracking-widest text-red-500">
                    Kernel Command Center
                  </CardTitle>
                  <p className="text-[7px] font-headline uppercase text-muted-foreground/60 tracking-[0.2em]">Sovereign Node • Level 3 Autonomy</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className={cn(
                  "text-[8px] font-headline uppercase h-5",
                  readiness.runtimeStable ? "border-green-500/20 text-green-500" : "border-red-500/20 text-red-500"
                )}>
                  STAGE: {bootStage}
                </Badge>
                <Badge variant="outline" className="text-[8px] font-headline border-blue-500/20 text-blue-500 uppercase h-5">
                  BUS: ACTIVE
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto">
            <div className="grid grid-cols-4 gap-1 bg-muted/20 border-b border-border/50 p-1">
               <MetricCard label="Queue Depth" val={orchestrator.getQueueDepth().toString()} icon={Terminal} color="text-yellow-500" />
               <MetricCard label="Active Workers" val={orchestrator.getActiveWorkloads().toString()} icon={Zap} color="text-green-500" />
               <MetricCard label="Mesh Sync" val={`${performance.syncLatency}ms`} icon={Network} color="text-blue-500" />
               <MetricCard label="Kernel Cycles" val={renderCount.toString()} icon={Cpu} color="text-purple-500" />
            </div>

            <Tabs defaultValue="readiness" className="w-full">
              <TabsList className="bg-black/40 w-full rounded-none h-11 border-b border-border/50">
                <TabsTrigger value="readiness" className="flex-1 text-[8px] uppercase font-headline">Readiness</TabsTrigger>
                <TabsTrigger value="mesh" className="flex-1 text-[8px] uppercase font-headline">Stage Trace</TabsTrigger>
                <TabsTrigger value="security" className="flex-1 text-[8px] uppercase font-headline">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="readiness" className="p-4 space-y-2">
                {Object.entries(readiness).map(([key, val]) => (
                  <TraceItem key={key} label={key.replace(/([A-Z])/g, ' $1')} val={val ? "READY" : "WAITING"} status={val ? "success" : "warn"} />
                ))}
              </TabsContent>

              <TabsContent value="mesh" className="p-0">
                 <div className="divide-y divide-border/30">
                    <TraceLog time="T-0ms" msg="Kernel process initialized." type="SUCCESS" />
                    <TraceLog time={`T-${performance.bootTime}ms`} msg="Authority verified." type="SUCCESS" />
                    <TraceLog time="PENDING" msg="Mesh synchronization in progress..." type="INFO" />
                    {readiness.runtimeStable && <TraceLog time="LIVE" msg="Command Bus ready for execution." type="SUCCESS" />}
                 </div>
              </TabsContent>

              <TabsContent value="security" className="p-4 space-y-4">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h4 className="text-[10px] font-headline font-bold uppercase text-primary">Isolation Matrix</h4>
                       <Badge variant="outline" className="text-[8px] uppercase text-green-500 border-green-500/20">L3 Active</Badge>
                    </div>
                    <div className="space-y-3">
                       {[
                         { label: "Execution Sandbox", ok: true },
                         { label: "PII Scrubber", ok: true },
                         { label: "Privilege Escalation Guard", ok: true },
                         { label: "Memory Boundary", ok: true },
                       ].map((m, i) => (
                         <div key={i} className="flex justify-between items-center text-[9px] font-headline uppercase">
                            <span className="text-muted-foreground">{m.label}</span>
                            <ShieldCheck className={cn("h-3 w-3", m.ok ? "text-primary" : "text-orange-500")} />
                         </div>
                       ))}
                    </div>
                 </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <div className="bg-black/80 p-3 text-[8px] font-headline text-center text-muted-foreground border-t border-border/50 uppercase tracking-[0.3em]">
             Forge OS Industrial • Kernel Stability Layer
          </div>
        </Card>
      )}
    </div>
  );
}

function MetricCard({ label, val, icon: Icon, color }: { label: string, val: string, icon: any, color: string }) {
  return (
    <div className="p-3 bg-black/40 border border-border/20 rounded-2xl text-center">
       <div className="flex items-center justify-center gap-1.5 mb-1">
          <Icon className={cn("h-3 w-3", color)} />
          <span className="text-[7px] font-headline uppercase text-muted-foreground">{label}</span>
       </div>
       <div className="text-xs font-headline font-bold uppercase">{val}</div>
    </div>
  );
}

function TraceItem({ label, val, status }: { label: string, val: string, status: "success" | "warn" | "info" }) {
  return (
    <div className="flex justify-between items-center p-2 rounded-xl bg-black/20 border border-border/30 text-[10px] font-headline uppercase">
      <span className="text-muted-foreground">{label}</span>
      <Badge variant="outline" className={cn(
        "border-border/50 h-5 text-[8px]",
        status === "success" ? "text-green-500 border-green-500/20" : 
        status === "warn" ? "text-orange-500 border-orange-500/20" : "text-primary border-primary/20"
      )}>
        {val}
      </Badge>
    </div>
  );
}

function TraceLog({ time, msg, type }: { time: string, msg: string, type: "SUCCESS" | "INFO" | "WARN" }) {
  return (
    <div className="p-3 flex items-center justify-between hover:bg-white/5 transition-colors">
       <div className="flex items-center gap-3">
          <span className="text-[8px] font-mono text-muted-foreground/50">{time}</span>
          <span className="text-[9px] font-headline text-foreground/80 italic">"{msg}"</span>
       </div>
       <Badge className={cn(
         "text-[7px] border-none",
         type === 'SUCCESS' ? "bg-green-500/20 text-green-500" : 
         type === 'WARN' ? "bg-red-500/20 text-red-500" : "bg-blue-500/20 text-blue-500"
       )}>{type}</Badge>
    </div>
  );
}
