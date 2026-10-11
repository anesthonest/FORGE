
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BrainCircuit, 
  Workflow, 
  Code, 
  ShieldCheck, 
  Database, 
  Zap,
  Lock,
  History,
  Activity,
  Cpu,
  TrendingUp,
  RefreshCcw,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const evolutionMetrics = [
  { label: "Token Efficiency", val: "+14.2%", icon: Zap, trend: "UP" },
  { label: "Execution Speed", val: "-124ms", icon: Activity, trend: "DOWN" },
  { label: "Self-Refactors", val: "42", icon: RefreshCcw, trend: "UP" },
  { label: "Neural Confidence", val: "0.98", icon: BrainCircuit, trend: "UP" },
];

const learnedPatterns = [
  { id: "P-441", name: "Async-First Middleware Pattern", confidence: 0.98, status: "Approved", type: "Code" },
  { id: "P-442", name: "High-Autonomy Sandboxing Rule", confidence: 0.99, status: "Approved", type: "Governance" },
  { id: "P-443", name: "Latency Reduction for Kernel-V2", confidence: 0.85, status: "Pending", type: "Infra" },
];

export function CognitiveLearning() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {evolutionMetrics.map((stat) => (
          <Card key={stat.label} className="bg-card border-border hover:border-primary/30 transition-all">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-4 w-4 text-primary" />
                <Badge variant="outline" className="text-[8px] h-4 font-headline uppercase border-primary/20 text-primary">EVOLVING</Badge>
              </div>
              <CardTitle className="text-xs font-headline uppercase tracking-widest">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-headline font-bold text-foreground">{stat.val}</span>
                <span className={cn(
                  "text-[8px] font-headline uppercase",
                  stat.trend === 'UP' ? "text-green-500" : "text-blue-500"
                )}>{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border bg-card/50 border-l-4 border-l-primary/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  ForgeOS Evolution Engine
                </CardTitle>
                <CardDescription className="text-[10px] font-headline">AUTONOMOUS SYSTEM SELF-IMPROVEMENT LOG</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-headline border-green-500/20 text-green-500">LEARNING MODE: ENABLED</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {learnedPatterns.map((pattern) => (
                <div key={pattern.id} className="p-4 rounded-lg bg-black/30 border border-border/50 flex items-center justify-between group hover:border-primary/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded bg-muted">
                      <History className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-headline font-bold">{pattern.name}</span>
                        <Badge variant="secondary" className="text-[8px] h-3 px-1 font-headline uppercase">{pattern.type}</Badge>
                      </div>
                      <div className="text-[9px] text-muted-foreground font-headline uppercase flex gap-4 mt-1">
                        <span>ID: {pattern.id}</span>
                        <span>CONFIDENCE: {(pattern.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={cn(
                    "text-[9px] font-headline h-5 uppercase",
                    pattern.status === 'Approved' ? "bg-green-500/20 text-green-500 border-green-500/30" : "bg-orange-500/20 text-orange-500 border-orange-500/30"
                  )} variant="outline">
                    {pattern.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Optimization Targets
            </CardTitle>
            <CardDescription className="text-[10px] font-headline uppercase">NEURAL PATH REFINEMENT</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Token Overhead", current: 82, target: 40, color: "text-orange-500" },
                { label: "Inference Latency", current: 65, target: 20, color: "text-blue-500" },
                { label: "Workflow Redundancy", current: 92, target: 10, color: "text-green-500" },
              ].map((t) => (
                <div key={t.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-headline uppercase">
                    <span>{t.label}</span>
                    <span className={t.color}>{t.current}%</span>
                  </div>
                  <Progress value={t.current} className="h-1 bg-muted" />
                  <div className="flex justify-between text-[8px] font-headline text-muted-foreground uppercase">
                    <span>Current: {t.current}%</span>
                    <span>Target: {t.target}%</span>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 rounded bg-primary/5 border border-primary/20">
                <p className="text-[9px] text-muted-foreground uppercase leading-tight italic">
                  Evolution Engine predicted a 14% efficiency gain by refactoring the "Sovereign-Edge" deployment workflow.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
