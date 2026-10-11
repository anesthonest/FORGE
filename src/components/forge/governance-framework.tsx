"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Scale, 
  Gavel,
  Binary,
  BrainCircuit,
  FileCheck,
  AlertCircle,
  ShieldQuestion,
  Info,
  History,
  Workflow,
  EyeOff,
  Flame,
  LayoutDashboard,
  Settings,
  Users,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const safetyLayers = [
  { 
    name: "Runtime Firewall", 
    status: "ENFORCED", 
    desc: "Prevent privilege escalation & dangerous execution.", 
    icon: Binary, 
    level: "Layer 1" 
  },
  { 
    name: "Residency Guard", 
    status: "ENFORCED", 
    desc: "GDPR/POPIA Data Localization & Edge Isolation.", 
    icon: Globe, 
    level: "Layer 2" 
  },
  { 
    name: "Cognitive Integrity", 
    status: "ACTIVE", 
    desc: "Detect hallucinations & injection attempts.", 
    icon: BrainCircuit, 
    level: "Layer 3" 
  },
];

const policies = [
  { id: "POL-001", name: "Agent Execution Boundary", mode: "Restrictive", status: "Active" },
  { id: "POL-002", name: "Regional Data Sovereignty", mode: "Strict-Residency", status: "Active" },
  { id: "POL-003", name: "Multi-Model Compliance", mode: "Whitelisted", status: "Active" },
  { id: "POL-004", name: "Cross-Region Audit", mode: "Encrypted-Only", status: "Active" },
];

export function GovernanceFramework() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-xl font-headline font-bold uppercase tracking-tighter flex items-center gap-2 text-primary">
            <LayoutDashboard className="h-5 w-5" />
            Sovereign Governance Hub
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase font-headline">Enterprise Policy Registry | Multi-Region Compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-8 text-[9px] font-headline uppercase border-border/50">
            <Settings className="h-3.5 w-3.5 mr-2" />
            Global Policies
          </Button>
          <Button variant="outline" className="h-8 text-[9px] font-headline uppercase border-border/50">
            <Users className="h-3.5 w-3.5 mr-2" />
            Tenant Isolation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {safetyLayers.map((layer) => (
          <Card key={layer.name} className="bg-card border-border hover:border-primary/30 transition-all border-b-4 border-b-primary/40 shadow-lg">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between mb-2">
                <layer.icon className="h-5 w-5 text-primary" />
                <Badge variant="outline" className="text-[9px] font-headline border-green-500/50 text-green-500">{layer.status}</Badge>
              </div>
              <CardTitle className="text-xs font-headline uppercase tracking-widest">{layer.name}</CardTitle>
              <CardDescription className="text-[9px] font-headline text-muted-foreground uppercase">{layer.level}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] text-muted-foreground leading-tight italic">"{layer.desc}"</p>
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
                  <Scale className="h-4 w-4 text-primary" />
                  Sovereign Compliance Registry
                </CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase">Deterministic Regional Residency Rules</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-headline border-primary/20 text-primary uppercase">Status: Compliant</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {policies.map((p) => (
                <div key={p.id} className="p-3 rounded-lg bg-black/30 border border-border/50 flex items-center justify-between group hover:border-primary/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-1.5 rounded bg-muted">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-headline font-bold uppercase">{p.name}</span>
                        <Badge variant="secondary" className="text-[8px] h-3.5 px-1 font-headline uppercase">Mode: {p.mode}</Badge>
                      </div>
                      <div className="text-[9px] text-muted-foreground font-headline uppercase flex gap-4 mt-1">
                        <span>ID: {p.id}</span>
                        <span className="text-green-500">Integrity: Verified</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[8px] font-headline border-primary/20 text-primary uppercase">
                    {p.status}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/20 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-primary" />
                <h4 className="text-[10px] font-headline font-bold uppercase text-primary tracking-widest">Data Localization Protocol</h4>
              </div>
              <p className="text-[9px] text-muted-foreground uppercase leading-tight italic">
                Cross-region data transfer is restricted for sovereign and GDPR-protected tenants. AI inference is automatically routed to the closest compliant node.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
              <Gavel className="h-4 w-4 text-primary" />
              Quota Enforcement
            </CardTitle>
            <CardDescription className="text-[10px] font-headline uppercase">Administrative Control Plane</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: "Regional Token Quota", current: 42, limit: "10M", color: "bg-primary" },
              { label: "Global Storage", current: 65, limit: "1PB", color: "bg-blue-500" },
              { label: "Active Nodes", current: 84, limit: "150", color: "bg-green-500" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-headline uppercase">
                  <span>{stat.label}</span>
                  <span className="text-muted-foreground">Limit: {stat.limit}</span>
                </div>
                <Progress value={stat.current} className="h-1 bg-muted" />
                <div className="text-[8px] font-headline text-right text-muted-foreground uppercase">
                  Capacity: {stat.current}%
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-border/30">
              <Button variant="default" className="w-full h-9 text-[10px] font-headline uppercase molten-glow">
                Adjust Global Quotas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
