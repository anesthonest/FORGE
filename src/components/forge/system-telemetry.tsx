
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  Binary,
  Globe,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

const nodeMetrics = [
  { id: "NODE-PRIME", region: "US-EAST", load: 42, latency: 124, status: "healthy" },
  { id: "NODE-EU-01", region: "EU-WEST", load: 68, latency: 210, status: "healthy" },
  { id: "NODE-AF-01", region: "UG-CENTRAL", load: 15, latency: 45, status: "healthy" },
  { id: "NODE-AP-01", region: "APAC-SOUTH", load: 82, latency: 340, status: "warning" },
];

export function SystemTelemetry() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { label: "Global Latency", val: "184ms", icon: Clock, color: "text-blue-500" },
          { label: "Model Fallbacks", val: "12", icon: Binary, color: "text-orange-500" },
          { label: "Quota Efficiency", val: "84.2%", icon: Zap, color: "text-primary" },
          { label: "Mesh Integrity", val: "99.9%", icon: ShieldCheck, color: "text-green-500" },
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border">
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
        <Card className="lg:col-span-2 border-border bg-card/50">
          <CardHeader>
             <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
               <Globe className="h-4 w-4 text-primary" />
               Distributed Runtime Nodes
             </CardTitle>
             <CardDescription className="text-[10px] font-headline">GLOBAL AGENT BUS PERFORMANCE</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nodeMetrics.map((node) => (
                <div key={node.id} className="p-3 rounded bg-black/30 border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded bg-muted">
                      <Cpu className={cn("h-4 w-4", node.status === 'healthy' ? "text-primary" : "text-orange-500")} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-headline font-bold">{node.id}</span>
                        <Badge variant="secondary" className="text-[8px] h-3.5 px-1 font-headline uppercase">{node.region}</Badge>
                      </div>
                      <div className="text-[9px] text-muted-foreground font-headline uppercase flex gap-4 mt-1">
                        <span>Lat: {node.latency}ms</span>
                        <span>Uptime: 99.9%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right w-32">
                      <div className="flex justify-between text-[8px] font-headline uppercase mb-1">
                        <span>Node Load</span>
                        <span className={node.load > 75 ? 'text-orange-500' : 'text-primary'}>{node.load}%</span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full transition-all", node.load > 75 ? 'bg-orange-500' : 'bg-primary')} style={{ width: `${node.load}%` }} />
                      </div>
                    </div>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      node.status === 'healthy' ? "bg-green-500" : "bg-orange-500 animate-pulse"
                    )} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              Sovereign Registry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-3">
               {[
                 { label: "Active Swarms", val: 142, limit: 1000 },
                 { label: "Cognitive Memory", val: 842, limit: 5000 },
                 { label: "Evolution Cycles", val: 42, limit: 100 },
               ].map((m, i) => (
                 <div key={i} className="space-y-1.5">
                   <div className="flex justify-between text-[10px] font-headline uppercase">
                     <span>{m.label}</span>
                     <span className="text-primary">{m.val} / {m.limit}</span>
                   </div>
                   <Progress value={(m.val/m.limit)*100} className="h-1 bg-muted" />
                 </div>
               ))}
             </div>

             <div className="pt-6 border-t border-border/30 space-y-3">
               <h4 className="text-[10px] font-headline font-bold uppercase text-red-500 flex items-center gap-2">
                 <ShieldCheck className="h-3.5 w-3.5" />
                 Security Perimeter
               </h4>
               <div className="grid grid-cols-2 gap-2">
                 <div className="p-2 rounded bg-muted/20 border border-border/50 text-center">
                    <div className="text-xs font-bold font-headline text-green-500">0</div>
                    <p className="text-[7px] font-headline uppercase text-muted-foreground">Critical Breaches</p>
                 </div>
                 <div className="p-2 rounded bg-muted/20 border border-border/50 text-center">
                    <div className="text-xs font-bold font-headline text-orange-500">14</div>
                    <p className="text-[7px] font-headline uppercase text-muted-foreground">Throttled Requests</p>
                 </div>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
