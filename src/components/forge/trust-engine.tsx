
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  History, 
  AlertCircle, 
  CheckCircle2, 
  BarChart3,
  Server,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

const trustCategories = [
  { name: "Security Reputation", score: 99.2, icon: ShieldCheck, color: "text-green-500", desc: "No critical vulnerabilities in generated code." },
  { name: "Execution Reliability", score: 94.5, icon: Zap, color: "text-yellow-500", desc: "Success rate for complex multi-agent tasks." },
  { name: "Governance Compliance", score: 100, icon: CheckCircle2, color: "text-blue-500", desc: "Strict adherence to sovereign policy rules." },
  { name: "Performance Stability", score: 88.7, icon: BarChart3, color: "text-orange-500", desc: "Latency and resource utilization overhead." },
];

const agentReputations = [
  { agent: "Hyper-Orchestrator", success: 99, hallucination: 0.01, rollbacks: 0 },
  { agent: "Coder", success: 92, hallucination: 2.1, rollbacks: 4 },
  { agent: "Architect", success: 97, hallucination: 0.5, rollbacks: 1 },
];

const marketplaceTrust = [
  { name: "K8s-Deployment-Pack", type: "Deployment", score: 98, status: "Verified" },
  { name: "NextJS-15-Template", type: "Template", score: 95, status: "Verified" },
  { name: "PostgreSQL-Plugin", type: "Plugin", score: 82, status: "Monitored" },
];

export function TrustEngine() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {trustCategories.map((cat) => (
          <Card key={cat.name} className="bg-card border-border hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <cat.icon className={cn("h-4 w-4", cat.color)} />
                <span className="text-xl font-headline font-bold">{cat.score}%</span>
              </div>
              <CardTitle className="text-[10px] uppercase font-headline text-muted-foreground mt-2">{cat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={cat.score} className="h-1 bg-muted mb-2" />
              <p className="text-[9px] text-muted-foreground leading-tight italic">"{cat.desc}"</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border bg-card/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
                  <Server className="h-4 w-4 text-primary" />
                  Agent Trust Matrix
                </CardTitle>
                <CardDescription className="text-[10px] font-headline">RELIABILITY METRICS ACROSS ACTIVE SWARM</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-headline border-primary/20 text-primary">SCAN: COMPLETED</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentReputations.map((agent) => (
                <div key={agent.agent} className="p-4 rounded-lg bg-black/20 border border-border/40 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-headline font-bold">{agent.agent}</div>
                    <div className="flex gap-4 text-[9px] font-headline uppercase text-muted-foreground">
                      <span>Success: <span className="text-green-500">{agent.success}%</span></span>
                      <span>Hallucination: <span className="text-red-500">{agent.hallucination}%</span></span>
                      <span>Rollbacks: <span className="text-orange-500">{agent.rollbacks}</span></span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-[10px] font-headline uppercase text-muted-foreground">Integrity Score</div>
                    <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${100 - (agent.hallucination * 10)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Marketplace Trust
            </CardTitle>
            <CardDescription className="text-[10px] font-headline">EXTERNAL ASSET INTEGRITY SCORES</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketplaceTrust.map((asset) => (
                <div key={asset.name} className="flex items-center justify-between p-2 rounded border border-border/30 bg-muted/10 group hover:border-primary/30 transition-all">
                  <div>
                    <div className="text-[11px] font-headline font-bold group-hover:text-primary transition-colors">{asset.name}</div>
                    <div className="text-[9px] font-headline text-muted-foreground uppercase">{asset.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-headline font-bold text-primary">{asset.score}%</div>
                    <Badge className={cn(
                      "text-[8px] h-3 px-1 font-headline uppercase",
                      asset.status === 'Verified' ? "bg-green-500/20 text-green-500" : "bg-orange-500/20 text-orange-500"
                    )} variant="outline">
                      {asset.status}
                    </Badge>
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
