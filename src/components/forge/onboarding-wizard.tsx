"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Code2, 
  Globe, 
  Terminal, 
  Sparkles, 
  Building2, 
  Zap, 
  ArrowRight,
  Monitor,
  Layout,
  Database,
  Layers,
  Cpu,
  ShieldCheck,
  Factory
} from "lucide-react";
import { cn } from "@/lib/utils";

export type OnboardingData = {
  goal: string;
  skill: string;
  type: string;
};

export function OnboardingWizard({ onComplete }: { onComplete: (data: OnboardingData) => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({ goal: "", skill: "", type: "" });

  const systems = [
    { id: "factory", title: "AI Software Factory", desc: "Autopilot mode: provision full production stacks", icon: Factory },
    { id: "builder", title: "Pattern Architect", desc: "Engineer mode: design high-fidelity systems", icon: Cpu },
    { id: "coding", title: "Production Assistant", desc: "Assistant mode: help with snippets and deployments", icon: Terminal },
    { id: "mesh", title: "Global Mesh Deploy", desc: "Provision and launch distributed nodes", icon: Globe },
  ];

  const domains = [
    { id: "fintech", title: "FinTech & Payments", icon: Database },
    { id: "ai", title: "AI Infrastructure", icon: Sparkles },
    { id: "saas", title: "Enterprise SaaS", icon: Layout },
    { id: "mesh", title: "Sovereign Mesh", icon: Globe },
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(data);
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 animate-in fade-in duration-1000">
      <div className="text-center mb-16">
        <div className="inline-flex p-5 rounded-3xl bg-primary/20 text-primary mb-6 molten-glow border border-primary/30">
          <Factory className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-headline font-bold uppercase italic tracking-tighter text-foreground">Initiate The Factory</h1>
        <p className="text-muted-foreground uppercase text-[10px] font-headline tracking-[0.3em] mt-3">Sovereign Engineering Fabric v12.0-Sovereign</p>
      </div>

      <Card className="border-border bg-card/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative border-t-4 border-t-primary rounded-3xl">
        <div className="absolute top-0 left-0 h-1 bg-muted w-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-700 ease-in-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        
        <CardHeader className="pt-12 px-10">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline" className="text-[10px] font-headline text-primary border-primary/20 bg-primary/5 uppercase">Protocol-0{step}</Badge>
            <span className="text-[9px] font-headline text-muted-foreground uppercase tracking-widest">{step === 1 ? "Intelligence Level" : step === 2 ? "Production Domain" : "Command Rank"}</span>
          </div>
          <CardTitle className="text-3xl font-headline font-bold uppercase italic tracking-tighter">
            {step === 1 ? "Select Capability Mode" : 
             step === 2 ? "Define Factory Output" : 
             "Verify Command Authority"}
          </CardTitle>
          <CardDescription className="text-[11px] uppercase font-headline text-muted-foreground/60 tracking-tight">Forge OS adapts its autonomous engineering fabric to your strategic requirements.</CardDescription>
        </CardHeader>

        <CardContent className="px-10 pb-12 pt-8">
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {systems.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { setData({ ...data, goal: g.id }); handleNext(); }}
                  className={cn(
                    "p-6 rounded-2xl border border-border/50 bg-black/30 text-left transition-all group hover:border-primary/60 hover:bg-primary/5 hover:scale-[1.02] shadow-lg",
                    data.goal === g.id && "border-primary bg-primary/10"
                  )}
                >
                  <g.icon className="h-7 w-7 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <div className="font-headline font-bold uppercase text-sm mb-1 tracking-tight">{g.title}</div>
                  <p className="text-[9px] text-muted-foreground leading-relaxed uppercase font-headline italic opacity-60">{g.desc}</p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {domains.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setData({ ...data, type: t.id }); handleNext(); }}
                  className={cn(
                    "p-6 rounded-2xl border border-border/50 bg-black/30 text-left transition-all group hover:border-primary/60 hover:bg-primary/5 hover:scale-[1.02] shadow-lg",
                    data.type === t.id && "border-primary bg-primary/10"
                  )}
                >
                  <t.icon className="h-7 w-7 text-primary mb-4" />
                  <div className="font-headline font-bold uppercase text-sm tracking-tight">{t.title}</div>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              {["Sovereign Operator", "Factory Architect", "Infrastructure Lead"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setData({ ...data, skill: s }); handleNext(); }}
                  className={cn(
                    "w-full p-8 rounded-2xl border border-border/50 bg-black/30 text-left transition-all group hover:border-primary/60 flex justify-between items-center shadow-lg",
                    data.skill === s && "border-primary bg-primary/10"
                  )}
                >
                  <div>
                    <div className="font-headline font-bold uppercase text-sm tracking-tight">{s}</div>
                    <p className="text-[10px] text-muted-foreground mt-2 font-headline uppercase opacity-60">Provision {s.toLowerCase()} level automation and sovereign reporting.</p>
                  </div>
                  <ShieldCheck className={cn("h-6 w-6 transition-colors", data.skill === s ? "text-primary" : "text-muted-foreground/20")} />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-12 flex justify-center">
        <p className="text-[9px] text-muted-foreground uppercase font-headline tracking-[0.4em] flex items-center gap-3">
          <Zap className="h-3 w-3 text-primary" />
          Autonomous Software Factory Active
          <Zap className="h-3 w-3 text-primary" />
        </p>
      </div>
    </div>
  );
}
