"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Server, 
  Database, 
  Cloud, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Zap, 
  HardDrive,
  RefreshCcw,
  Box,
  Terminal,
  Layers,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockClusters = [
  { id: "CL-US-01", name: "Core Production Mesh", provider: "Sovereign-Cloud", nodes: 42, health: 99.9, load: 34 },
  { id: "CL-EU-01", name: "Compliance Zone Alpha", provider: "Isolated-K8s", nodes: 12, health: 100, load: 12 },
  { id: "CL-AF-01", name: "Edge Node Central", provider: "Local-Fiber", nodes: 8, health: 98.4, load: 78 },
];

export function InfrastructureGrid() {
  const [activeTab, setActiveTab] = useState('clusters');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-headline font-bold uppercase tracking-tighter flex items-center gap-2 text-primary">
            <Server className="h-5 w-5" />
            ForgeOS Enterprise Infrastructure
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase font-headline">Distributed Cluster Orchestration & Node Management</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="h-9 text-[9px] font-headline uppercase border-border/50">
             <Layers className="h-3.5 w-3.5 mr-2" /> Global Manifest
           </Button>
           <Button className="h-9 text-[9px] font-headline uppercase molten-glow">
             <Plus className="h-3.5 w-3.5 mr-2" /> Provision Cluster
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockClusters.map((cluster) => (
          <Card key={cluster.id} className="bg-card border-border hover:border-primary/30 transition-all border-l-4 border-l-primary/50 shadow-xl group">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded bg-primary/10 text-primary group-hover:molten-glow transition-all">
                  <Cloud className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[8px] h-4 font-headline uppercase border-green-500/20 text-green-500">HEALTHY</Badge>
              </div>
              <CardTitle className="text-sm font-headline font-bold uppercase tracking-widest">{cluster.name}</CardTitle>
              <CardDescription className="text-[10px] font-headline uppercase text-muted-foreground">{cluster.provider} • {cluster.id}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <p className="text-[8px] font-headline text-muted-foreground uppercase">Active Nodes</p>
                    <div className="flex items-center gap-2 text-lg font-headline font-bold">
                       <Cpu className="h-3.5 w-3.5 text-primary" /> {cluster.nodes}
                    </div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[8px] font-headline text-muted-foreground uppercase">Load Distribution</p>
                    <div className="flex items-center gap-2 text-lg font-headline font-bold">
                       <Zap className="h-3.5 w-3.5 text-orange-500" /> {cluster.load}%
                    </div>
                 </div>
              </div>
              <div className="space-y-1.5">
                 <div className="flex justify-between text-[8px] font-headline uppercase">
                    <span>Cluster Efficiency</span>
                    <span>{cluster.health}%</span>
                 </div>
                 <Progress value={cluster.health} className="h-1 bg-muted" />
              </div>
              <Button variant="ghost" className="w-full h-8 text-[9px] font-headline uppercase border border-border/50 hover:bg-primary/5 group-hover:border-primary/30 transition-all">
                Access Node Control
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card/30">
        <CardHeader className="border-b border-border/50 px-6 py-4">
           <CardTitle className="text-xs font-headline uppercase tracking-widest flex items-center gap-2">
             <Terminal className="h-4 w-4 text-primary" />
             Infrastructure Resource Ledger
           </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
           <div className="divide-y divide-border/30">
              {[
                { time: "04:12:04", event: "NODE_AUTOSCALE", target: "CL-US-01", msg: "Increased replica count from 3 to 12 due to detected traffic spike.", status: "SUCCESS" },
                { time: "03:45:12", event: "CERT_ROTATION", target: "CL-EU-01", msg: "Automatic rotation of TLS certificates for edge endpoints completed.", status: "SUCCESS" },
                { time: "02:20:01", event: "HEAL_PROTOCOL", target: "CL-AF-01", msg: "Detected unhealthy node pod-942. Pod restarted and verified.", status: "RECOVERED" },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 group hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                     <span className="text-[9px] font-headline text-muted-foreground opacity-50">[{log.time}]</span>
                     <span className="text-[10px] font-headline font-bold text-primary">{log.event}</span>
                     <span className="text-[10px] font-headline text-muted-foreground italic truncate max-w-[400px]">"{log.msg}"</span>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[8px] h-4 uppercase font-headline",
                    log.status === 'SUCCESS' ? "border-green-500/20 text-green-500" : "border-primary/20 text-primary"
                  )}>{log.status}</Badge>
                </div>
              ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Plus(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="12 5v14"/></svg>
  )
}
