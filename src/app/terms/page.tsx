"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hammer, ChevronLeft, ShieldCheck, Scale, AlertCircle } from "lucide-react";

export default function TermsPage() {
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
            <Badge variant="outline" className="w-fit mx-auto mb-4 text-[8px] font-headline border-primary/20 text-primary uppercase">Version 1.0.0-PROD</Badge>
            <CardTitle className="text-3xl font-headline font-bold uppercase italic tracking-tighter">Terms of Service</CardTitle>
            <p className="text-[10px] text-muted-foreground uppercase font-headline mt-2 tracking-[0.2em]">Sovereign Engineering Fabric Agreement</p>
          </CardHeader>
          <CardContent className="p-8 md:p-12 space-y-8 font-body text-sm text-foreground/80 leading-relaxed">
            <section className="space-y-4">
              <h3 className="text-primary font-headline font-bold uppercase text-xs flex items-center gap-2">
                <Scale className="h-4 w-4" /> 1. Ownership and Authority
              </h3>
              <p>
                Forge OS is a proprietary autonomous engineering fabric developed and owned by <strong>VINEXSAH TECHNOLOGIES</strong>. All rights, title, and interest in and to the platform, including its execution kernel, specialized agents, and distributed mesh topology, remain the exclusive property of VINEXSAH TECHNOLOGIES.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-primary font-headline font-bold uppercase text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> 2. Acceptable Use Policy
              </h3>
              <p>
                Operators are granted a non-exclusive license to utilize the Forge OS mesh for software fabrication and system orchestration. Prohibited activities include, but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-primary">
                <li>Attempting to breach the sovereign execution sandbox or escalate kernel privileges.</li>
                <li>Utilizing AI swarms for the generation of malicious payloads or illegal artifacts.</li>
                <li>Reverse engineering the Forge OS internal routing logic or billing identity systems.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-primary font-headline font-bold uppercase text-xs flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> 3. AI Usage and Liability
              </h3>
              <p>
                Forge OS utilizes multi-provider generative AI (Gemini/OpenAI). While the platform employs high-fidelity "Sentinel" auditing, VINEXSAH TECHNOLOGIES does not guarantee the absolute accuracy or safety of generated code artifacts. Operators must perform manual architectural reviews before deploying artifacts to production environments.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-primary font-headline font-bold uppercase text-xs flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> 4. Subscriptions and Settlement
              </h3>
              <p>
                Access to advanced mesh capabilities is gated by tiered licensing. Settlement is performed via regional gateways (Stripe/Mobile Money). Failure to maintain "Active" subscription status will result in immediate autonomous throttling of reasoning capabilities.
              </p>
            </section>

            <div className="pt-12 border-t border-border/50 text-center space-y-2">
              <p className="text-[10px] font-headline uppercase text-muted-foreground italic">
                © 2026 VINEXSAH TECHNOLOGIES. All rights reserved.
              </p>
              <p className="text-[8px] font-headline uppercase text-muted-foreground/40 tracking-widest">
                Sovereign Fabrication Runtime • End User License Agreement
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Badge({ children, className, variant }: any) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}
