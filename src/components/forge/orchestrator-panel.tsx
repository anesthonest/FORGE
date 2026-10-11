"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Loader2, 
  Zap,
  Workflow,
  Target,
  ShieldAlert,
  ArrowUpCircle,
  History,
  Activity,
  Cpu,
  Layers,
  Terminal,
  Search,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useForgeRuntime } from "@/context/forge-runtime-context";
import { orchestrator } from "@/lib/orchestrator/orchestration-engine";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Orchestrator Panel (Stabilized v70.2)
 * Wired to the Orchestration Command Bus with readiness guarding.
 */

export function OrchestratorPanel() {
  const [goal, setGoal] = useState("");
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [lastTaskId, setLastTaskId] = useState<string | null>(null);
  
  const { readiness, bootStage } = useForgeRuntime();

  const canExecute = readiness.runtimeStable && readiness.hydrationComplete;

  const handleOrchestrate = async () => {
    if (!goal.trim() || !canExecute) return;
    
    setIsOrchestrating(true);
    const taskId = await orchestrator.enqueue("AI_COMMAND", { command: goal }, "HIGH");
    setLastTaskId(taskId);
    
    // Simulate immediate feedback
    setTimeout(() => {
      setIsOrchestrating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card shadow-xl overflow-hidden relative border-t-4 border-t-primary">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Terminal className="h-32 w-32" />
        </div>
        <CardHeader className="border-b border-border/50 bg-muted/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-primary/10 text-primary border border-primary/20">
                <Workflow className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-headline tracking-tighter uppercase italic text-foreground">Forge OS Command Bus</CardTitle>
                <CardDescription className="text-[10px] uppercase font-headline font-bold text-muted-foreground">
                  Validated Execution Environment
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={cn(
                "text-[9px] font-headline uppercase",
                canExecute ? "border-green-500/30 text-green-500" : "border-orange-500/30 text-orange-500 animate-pulse"
              )}>
                KERNEL: {canExecute ? "STABLE" : bootStage.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            {!canExecute && (
              <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] rounded-xl flex items-center justify-center border border-border/50">
                 <div className="flex flex-col items-center gap-2 text-center p-6">
                   <Lock className="h-6 w-6 text-primary" />
                   <p className="text-[10px] font-headline text-primary uppercase font-bold tracking-widest">Hydrating Execution Context...</p>
                 </div>
              </div>
            )}
            <Textarea 
              placeholder="Command Forge OS Kernel (e.g., 'Execute regional telemetry audit')..."
              className="min-h-[140px] bg-black/20 border-border focus:ring-primary font-body text-sm resize-none"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              disabled={!canExecute}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-[10px] font-headline text-muted-foreground uppercase">
              <Cpu className="h-3 w-3 text-primary" />
              Runtime: {readiness.runtimeStable ? 'STABLE' : 'STABILIZING'}
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="font-headline text-xs tracking-tight border-border/50 h-11 px-6 rounded-xl"
                onClick={() => setGoal("")}
                disabled={!canExecute}
              >
                CLEAR
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-headline text-xs tracking-tighter uppercase px-12 h-11 molten-glow rounded-xl"
                onClick={handleOrchestrate}
                disabled={isOrchestrating || !goal.trim() || !canExecute}
              >
                {isOrchestrating ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Zap className="mr-2 h-4 w-4" /> EXECUTE</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {lastTaskId && (
        <Card className="border-l-4 border-l-green-500 bg-card/50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[10px] font-headline uppercase flex items-center gap-2 text-green-500">
                <CheckCircle2 className="h-3.5 w-3.5" /> Command Dispatched
              </CardTitle>
              <span className="text-[8px] font-mono opacity-50">T-ID: {lastTaskId}</span>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
