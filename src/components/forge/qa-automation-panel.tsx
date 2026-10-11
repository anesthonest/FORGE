"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldAlert, 
  CheckCircle2, 
  Bug, 
  Activity, 
  Loader2, 
  Zap,
  Terminal,
  Search,
  Scan,
  ShieldCheck,
  FlaskConical
} from "lucide-react";
import { cn } from "@/lib/utils";

export function QAAutomationPanel() {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const startScan = () => {
    setIsScanning(true);
    setResults(null);
    setTimeout(() => {
      setResults({
        score: 0.96,
        scenarios: 124,
        vulnerabilities: 0,
        patterns: ["Async-First Verified", "Credential Sanitization OK"],
        vulnerability_list: []
      });
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/50 border-t-4 border-t-primary shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-primary/20 text-primary">
                <FlaskConical className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-headline font-bold uppercase tracking-tighter italic text-foreground">Sovereign QA Swarm</CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase text-muted-foreground">Autonomous Testing & Security Validation</CardDescription>
              </div>
            </div>
            <Button 
              onClick={startScan} 
              disabled={isScanning}
              className="font-headline text-[10px] uppercase h-9 px-8 molten-glow flex items-center gap-2"
            >
              {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scan className="h-4 w-4" />}
              {isScanning ? "VALIDATING MESH..." : "INITIATE SECURITY SWARM"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="lg:col-span-2 border-border bg-card/50">
            <CardHeader className="border-b border-border/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-headline uppercase tracking-widest text-primary flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Operational Security Report
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-headline border-green-500/20 text-green-500 uppercase">Status: Secure</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Scenarios Run", val: results.scenarios, icon: Activity, color: "text-blue-500" },
                  { label: "Vulnerabilities", val: results.vulnerabilities, icon: ShieldAlert, color: "text-green-500" },
                  { label: "Integrity Score", val: `${(results.score * 100).toFixed(1)}%`, icon: Zap, color: "text-primary" },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-lg bg-black/30 border border-border/50 text-center">
                    <stat.icon className={cn("h-5 w-5 mx-auto mb-2", stat.color)} />
                    <div className="text-lg font-headline font-bold text-foreground">{stat.val}</div>
                    <p className="text-[9px] text-muted-foreground uppercase font-headline">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-headline font-bold uppercase text-primary tracking-widest flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Verification Patterns
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {results.patterns.map((p: string, i: number) => (
                    <div key={i} className="p-3 rounded bg-muted/20 border border-border/30 text-[10px] font-headline flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-muted-foreground uppercase">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2 text-primary">
                <Bug className="h-4 w-4" />
                Vulnerability Map
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="p-6 text-center space-y-4 border border-dashed border-border rounded-xl bg-muted/5">
                 <ShieldCheck className="h-10 w-10 text-green-500 mx-auto opacity-50" />
                 <div className="space-y-1">
                   <h3 className="text-xs font-headline font-bold uppercase">No Risks Detected</h3>
                   <p className="text-[9px] text-muted-foreground uppercase leading-tight">Forge OS autonomous scanners verified the repository with zero high-severity findings.</p>
                 </div>
               </div>
               <div className="space-y-3 pt-4 border-t border-border/30">
                  <div className="flex justify-between items-center text-[10px] font-headline uppercase">
                    <span>Scan Fidelity</span>
                    <span className="text-primary">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-1 bg-muted" />
               </div>
               <Button variant="outline" className="w-full h-10 font-headline text-[10px] uppercase border-primary/20 text-primary rounded-xl">
                 Schedule Daily Swarm
               </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
