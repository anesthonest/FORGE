
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateEnterpriseProposal, type EnterpriseSalesOutput } from "@/ai/flows/enterprise-sales-flow";
import { 
  Building2, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  Briefcase, 
  Rocket, 
  Loader2, 
  ArrowRight,
  CheckCircle2,
  PieChart,
  Target,
  Users,
  BadgeDollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function EnterpriseExpansion() {
  const [desc, setDesc] = useState("");
  const [isExpanding, setIsExpanding] = useState(false);
  const [proposal, setProposal] = useState<EnterpriseSalesOutput | null>(null);

  const handleExpand = async () => {
    if (!desc.trim()) return;
    setIsExpanding(true);
    try {
      const result = await generateEnterpriseProposal({ companyDescription: desc });
      setProposal(result);
    } catch (error) {
      console.error("Sales flow failed:", error);
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/50 border-t-4 border-t-blue-500 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-blue-500/20 text-blue-500">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-headline font-bold uppercase tracking-tighter italic">Enterprise Expansion Swarm</CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase text-muted-foreground">Autonomous Sales Engineering & ROI Simulation</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-headline border-blue-500/20 text-blue-500 uppercase">Status: Growth Mode</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Enter target enterprise profile (e.g., 'Global Banking Group with 1400 legacy nodes')..."
            className="min-h-[100px] bg-black/30 border-border font-body text-sm"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button 
              onClick={handleExpand}
              disabled={isExpanding || !desc.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-headline text-[10px] uppercase h-10 px-8 flex items-center gap-2"
            >
              {isExpanding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  NEGOTIATING...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  TRIGGER ENTERPRISE EXPANSION
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {proposal && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="lg:col-span-2 border-border bg-card/50">
            <CardHeader className="border-b border-border/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-headline uppercase tracking-widest text-blue-500 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {proposal.proposal_title}
                </CardTitle>
                <Badge variant="outline" className="text-[9px] font-headline">OPP: {proposal.opportunity_id}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Cost Reduction", val: proposal.roi_summary.cost_reduction, icon: BadgeDollarSign, color: "text-green-500" },
                  { label: "Efficiency Boost", val: proposal.roi_summary.efficiency_boost, icon: TrendingUp, color: "text-blue-500" },
                  { label: "Payback Period", val: proposal.roi_summary.payback_period, icon: Rocket, color: "text-orange-500" },
                ].map((roi, i) => (
                  <div key={i} className="p-4 rounded-lg bg-black/30 border border-border/50 text-center">
                    <roi.icon className={cn("h-5 w-5 mx-auto mb-2", roi.color)} />
                    <div className="text-lg font-headline font-bold">{roi.val}</div>
                    <p className="text-[9px] text-muted-foreground uppercase font-headline">{roi.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-headline font-bold uppercase text-blue-500 tracking-widest flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Compliance & Contract Manifest
                </h4>
                <div className="p-4 rounded bg-muted/20 border border-border/30 text-xs font-body italic">
                  "{proposal.legal_manifest_summary}"
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2 text-primary">
                <Briefcase className="h-4 w-4" />
                Suggested Package
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center space-y-2">
                <Badge className="bg-primary text-primary-foreground font-headline uppercase text-[10px] mb-2">{proposal.suggested_package.tier}</Badge>
                <div className="text-2xl font-headline font-bold">{proposal.suggested_package.monthly_price}</div>
                <p className="text-[9px] text-muted-foreground uppercase font-headline italic">Per Month / Enterprise Licensing</p>
              </div>
              <div className="space-y-3">
                {proposal.suggested_package.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-headline uppercase">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    {f}
                  </div>
                ))}
              </div>
              <Button className="w-full h-10 font-headline text-[10px] uppercase molten-glow mt-4">
                Initialize Enterprise Onboarding
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
