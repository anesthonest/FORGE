"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileCode, 
  Layout, 
  Database, 
  Server, 
  Terminal, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2,
  Box,
  Share2,
  Rocket,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

export function LiveBuildView({ goal }: { goal: string }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Architecting...");
  const [files, setFiles] = useState<string[]>([]);
  const [steps, setSteps] = useState([
    { title: "Project Scaffolding", status: "working" },
    { title: "Architecture Design", status: "pending" },
    { title: "Component Generation", status: "pending" },
    { title: "Security Audit", status: "pending" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 400);

    const fileTimer = setInterval(() => {
      const mockFiles = ["package.json", "tailwind.config.js", "src/app/page.tsx", "src/components/ui/button.tsx", "src/lib/utils.ts"];
      setFiles((prev) => {
        if (prev.length >= mockFiles.length) {
          clearInterval(fileTimer);
          return prev;
        }
        return [...prev, mockFiles[prev.length]];
      });
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(fileTimer);
    };
  }, []);

  useEffect(() => {
    if (progress > 25) setSteps(s => s.map((step, i) => i === 0 ? { ...step, status: 'complete' } : i === 1 ? { ...step, status: 'working' } : step));
    if (progress > 50) setSteps(s => s.map((step, i) => i === 1 ? { ...step, status: 'complete' } : i === 2 ? { ...step, status: 'working' } : step));
    if (progress > 85) setSteps(s => s.map((step, i) => i === 2 ? { ...step, status: 'complete' } : i === 3 ? { ...step, status: 'working' } : step));
    if (progress === 100) {
      setSteps(s => s.map(step => ({ ...step, status: 'complete' })));
      setStatus("Build Complete");
    }
  }, [progress]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-6 duration-700">
      <Card className="lg:col-span-2 border-border bg-card/30 backdrop-blur-sm overflow-hidden flex flex-col">
        <CardHeader className="border-b border-border/50 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-primary/20 text-primary">
                <Box className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-headline uppercase italic tracking-widest">{goal.slice(0, 30)}...</CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase">Autonomous Build Session: Active</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right mr-3 hidden sm:block">
                <div className="text-[10px] font-headline uppercase text-muted-foreground">Completion</div>
                <div className="text-sm font-headline font-bold text-primary">{progress}%</div>
              </div>
              <Badge variant="outline" className="text-[10px] font-headline border-primary/30 text-primary animate-pulse">
                {status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="p-4 border-b border-border/30 bg-muted/5">
             <Progress value={progress} className="h-1.5 bg-muted" />
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 border-r border-border/30 space-y-6">
              <h4 className="text-[10px] font-headline font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                <Terminal className="h-3 w-3" /> Execution Roadmap
              </h4>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      {step.status === 'complete' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : step.status === 'working' ? (
                        <Loader2 className="h-4 w-4 text-primary animate-spin" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-border/50" />
                      )}
                      <span className={cn(
                        "text-xs font-headline uppercase transition-colors",
                        step.status === 'working' ? "text-primary font-bold" : 
                        step.status === 'complete' ? "text-foreground" : "text-muted-foreground"
                      )}>{step.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-black/40 space-y-6">
              <h4 className="text-[10px] font-headline font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                <FileCode className="h-3 w-3" /> Generated Artifacts
              </h4>
              <div className="space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/20 border border-border/30 text-[10px] font-headline animate-in slide-in-from-right-2">
                    <FileCode className="h-3 w-3 text-blue-400" />
                    <span className="truncate">{file}</span>
                    <Badge className="ml-auto text-[7px] bg-green-500/10 text-green-500 border-none h-3 px-1">STAGED</Badge>
                  </div>
                ))}
                {files.length === 0 && (
                  <div className="text-[10px] text-muted-foreground uppercase font-headline italic">Waiting for architect...</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-xs font-headline uppercase tracking-widest flex items-center gap-2 text-primary">
              <Rocket className="h-4 w-4" />
              Build Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <Button className="w-full h-10 font-headline text-[10px] uppercase molten-glow" disabled={progress < 100}>
               Finalize & Export
             </Button>
             <Button variant="outline" className="w-full h-10 font-headline text-[10px] uppercase border-border/50" disabled={progress < 100}>
               <Rocket className="h-3.5 w-3.5 mr-2" /> One-Click Deploy
             </Button>
             <Button variant="ghost" className="w-full h-10 font-headline text-[10px] uppercase text-muted-foreground">
               Pause Execution
             </Button>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="p-4">
            <CardTitle className="text-xs font-headline uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Build Integrity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="flex justify-between items-center text-[10px] font-headline uppercase">
              <span>Security Score</span>
              <span className="text-green-500 font-bold">99.9%</span>
            </div>
            <Progress value={99.9} className="h-1 bg-muted" />
            <p className="text-[8px] text-muted-foreground uppercase font-headline leading-tight italic">
              "Sentinel agent has verified the architecture against ForgeOS production standards. No vulnerabilities detected."
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}