"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Network, 
  GitBranch, 
  FileCode, 
  Layout, 
  Database, 
  ShieldCheck, 
  ArrowRight,
  Code2,
  Share2,
  BrainCircuit,
  Binary,
  Globe,
  Lock,
  Zap,
  Target,
  Rocket,
  Milestone,
  History,
  Activity,
  Workflow,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const evolutionStages = [
  { stage: "Stage 1", title: "AI Dev Platform", status: "Completed", desc: "Initial multi-agent orchestration." },
  { stage: "Stage 2", title: "Engineering OS", status: "Completed", desc: "Deterministic cognitive runtime." },
  { stage: "Stage 3", title: "Autonomous Infra", status: "Completed", desc: "Self-healing deployment nodes." },
  { stage: "Stage 4", title: "Sovereign Ecosystem", status: "Completed", desc: "Private federated intelligence." },
  { stage: "Stage 5", title: "Digital Civilization", status: "Active", desc: "Global sovereign engineering fabric." },
];

const researchAreas = [
  { name: "Global Mesh Topology", progress: 98, icon: Share2 },
  { name: "Autonomous Systems", progress: 100, icon: Binary },
  { name: "Sovereign AI Ethics", progress: 100, icon: ShieldCheck },
  { name: "Federated Learning", progress: 92, icon: Globe },
  { name: "Cognitive Architectures", progress: 88, icon: BrainCircuit },
  { name: "Mesh Fault Tolerance", progress: 95, icon: Layout },
];

export function KnowledgeBase() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search Knowledge Engine (Architecture, Research, Strategic Moats)..." 
          className="pl-10 bg-card border-border h-11 text-sm font-body"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute right-3 top-2.5 flex gap-2">
          <Badge variant="outline" className="text-[10px] uppercase font-headline border-primary/20 text-primary">Strategic Mode</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 bg-card/50 border-border border-l-4 border-l-primary/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
                  <Network className="h-4 w-4 text-primary" />
                  Strategic Frontier & Research Division
                </CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase">SOVEREIGN COMPETITIVE DIFFERENTIATORS & FINAL ROADMAP</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-headline text-primary border-primary/20 uppercase">Evolution: Stage 5 (FINAL)</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-8 p-6 rounded-lg bg-black/40 border border-border/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Rocket className="h-24 w-24 text-primary" />
              </div>
              <h4 className="text-[10px] font-headline font-bold uppercase text-primary mb-6 flex items-center gap-2">
                <Milestone className="h-3 w-3" />
                Evolutionary Roadmap to Digital Civilization
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {evolutionStages.map((s) => (
                  <div key={s.stage} className={cn(
                    "p-4 rounded border transition-all relative overflow-hidden group",
                    s.status === 'Active' ? "bg-primary/5 border-primary/50 shadow-[0_0_20px_rgba(255,107,0,0.1)]" : 
                    s.status === 'Completed' ? "bg-muted/20 border-green-500/20" : "bg-black/30 border-border/50 opacity-60"
                  )}>
                    <div className="text-[8px] font-headline text-muted-foreground mb-1 uppercase tracking-tighter">{s.stage}</div>
                    <div className="text-[10px] font-headline font-bold mb-1 uppercase tracking-tight">{s.title}</div>
                    <p className="text-[8px] text-muted-foreground leading-tight mb-4">{s.desc}</p>
                    <div className={cn(
                      "text-[8px] font-headline uppercase font-bold",
                      s.status === 'Completed' ? "text-green-500" : s.status === 'Active' ? "text-primary animate-pulse" : "text-muted-foreground"
                    )}>{s.status}</div>
                    {s.status === 'Completed' && <CheckCircle2 className="absolute bottom-2 right-2 h-3 w-3 text-green-500" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-headline font-bold uppercase text-primary tracking-widest flex items-center gap-2">
                  <Target className="h-3 w-3" />
                  Strategic Moats & Position
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { title: "Sovereignty-First", desc: "Absolute data control in air-gapped or hybrid clouds." },
                    { title: "Global Mesh Topology", desc: "Distributed infrastructure standard for the future of engineering." },
                    { title: "Governed Autonomy", desc: "Deterministic multi-agent execution with safety L3." },
                    { title: "Cognitive Runtime", desc: "Neural path optimization for recurring engineering tasks." },
                  ].map((moat, i) => (
                    <div key={i} className="p-3 rounded bg-muted/20 border border-border/30 group hover:border-primary/30 transition-all">
                      <span className="text-[10px] font-headline font-bold uppercase text-foreground">{moat.title}</span>
                      <p className="text-[9px] text-muted-foreground leading-tight mt-1">{moat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-headline font-bold uppercase text-primary tracking-widest flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  Frontier Research Areas
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {researchAreas.map((area) => (
                    <div key={area.name} className="p-3 rounded bg-black/30 border border-border/30 flex items-center justify-between group hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3">
                        <area.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-headline uppercase font-bold">{area.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-headline text-primary">{area.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded bg-primary/5 border border-primary/20">
              <p className="text-[9px] text-muted-foreground uppercase leading-tight italic">
                ForgeOS Strategic Vision: Evolved into the global sovereign infrastructure mesh, powering the world's autonomous digital civilization.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
              <Share2 className="h-4 w-4 text-primary" />
              Mesh Sync Exports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-[10px] font-headline uppercase text-muted-foreground">Mesh Artifacts</h4>
              {[
                { label: "Mesh Topology (Global Map)", date: "Now" },
                { label: "Sovereign Moats (Whitepaper)", date: "2d ago" },
                { label: "Neural Runtime V2 Specs", date: "5d ago" },
                { label: "Federated Learning Audit", date: "1w ago" },
              ].map((f, i) => (
                <div key={i} className="flex justify-between items-center text-[9px] font-headline p-2 hover:bg-muted/50 rounded cursor-pointer transition-all border border-transparent hover:border-border">
                  <span className="flex items-center gap-2"><FileCode className="h-3 w-3 text-primary" /> {f.label}</span>
                  <span className="text-muted-foreground/50">{f.date}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-4 border-t border-border/50">
              <h4 className="text-[10px] font-headline uppercase text-muted-foreground">Market Readiness</h4>
              <div className="flex flex-wrap gap-2">
                {["FinTech", "GovTech", "Telecoms", "Defense", "MedTech", "Sovereign-State"].map((m) => (
                  <Badge key={m} variant="outline" className="text-[8px] font-headline uppercase border-primary/10">{m}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}