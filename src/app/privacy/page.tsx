"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hammer, ChevronLeft, ShieldCheck, EyeOff, Database, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background forge-grid p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-[10px] font-headline uppercase gap-2">
              <ChevronLeft className="h-4 w-4" /> Back to Terminal
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-primary">
            <Hammer className="h-6 w-6" />
            <span className="font-headline font-bold text-xl tracking-tighter uppercase italic">Forge OS</span>
          </div>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur-xl border-t-4 border-t-primary rounded-3xl shadow-2xl">
          <CardHeader className="text-center pb-8 border-b border-border/50">
            <div className="w-fit mx-auto mb-4 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-500 text-[8px] font-headline uppercase">Data Residency: ACTIVE</div>
            <CardTitle className="text-3xl font-headline font-bold uppercase italic tracking-tighter">Privacy Policy</CardTitle>
            <p className="text-[10px] text-muted-foreground uppercase font-headline mt-2 tracking-[0.2em]">Operator Data Protection & Residency Protocol</p>
          </CardHeader>
          <CardContent className="p-8 md:p-12 space-y-8 font-body text-sm text-foreground/80 leading-relaxed">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex gap-4 items-center mb-8">
               <EyeOff className="h-8 w-8 text-primary shrink-0" />
               <p className="text-xs font-headline uppercase font-bold text-primary">
                 Industrial Mandate: Forge OS does not sell operator data to third parties. All intelligence generated within the mesh belongs to the sovereign operator.
               </p>
            </div>

            <section className="space-y-4">
              <h3 className="text-primary font-headline font-bold uppercase text-xs flex items-center gap-2">
                <Database className="h-4 w-4" /> 1. Data Collection & Telemetry
              </h3>
              <p>
                Forge OS collects strictly required operational telemetry to maintain mesh integrity:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                <li><strong>Authentication Data:</strong> Email and identity identifiers for session management.</li>
                <li><strong>Inference Logs:</strong> Prompt and completion tokens for billing and failover tracking.</li>
                <li><strong>System Vitals:</strong> Performance metrics used by autonomous self-healing agents.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-primary font-headline font-bold uppercase text-xs flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> 2. AI Prompt Privacy
              </h3>
              <p>
                Prompts dispatched to the AI Gateway (Gemini/OpenAI) are processed through an industrial scrubber to remove PII before transmission where applicable. We do not use operator prompts to train global models without explicit "Stage 5" opt-in.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-primary font-headline font-bold uppercase text-xs flex items-center gap-2">
                <Lock className="h-4 w-4" /> 3. Data Residency
              </h3>
              <p>
                Forge OS supports multi-region residency. Operators in regulated domains (GDPR/POPIA) have their operational ledger pinned to local sovereign nodes to ensure compliance with regional statutes.
              </p>
            </section>

            <div className="pt-12 border-t border-border/50 text-center space-y-2">
              <p className="text-[10px] font-headline uppercase text-muted-foreground italic">
                Sovereign Privacy Protocol v1.0 • Authorized by VINEXSAH TECHNOLOGIES
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
