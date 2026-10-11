"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Search,
  Settings2,
  Bot,
  Binary,
  Workflow,
  Loader2,
  RefreshCcw,
  Layers,
  Terminal,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { agentOrchestrator } from "@/lib/agents/agent-orchestrator";
import { SpecializedAgents } from "@/lib/agents/specialized-agents";

/**
 * @fileOverview Forge OS AI Agent mesh dashboard.
 * Real-time monitoring of autonomous workers and task queues.
 */

export function AgentPoolView() {
  const [stats, setStats] = useState(agentOrchestrator.getMeshStats());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(agentOrchestrator.getMeshStats());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleManualTrigger = async () => {
    setIsRefreshing(true);
    await SpecializedAgents.monitorNode("global-mesh-root");
    await SpecializedAgents.triggerBillingAudit("sys-admin");
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-headline font-bold uppercase tracking-tighter flex items-center gap-2 text-primary">
            <Bot className="h-5 w-5" />
            Autonomous Agent Command
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase font-headline">Enterprise Multi-Agent Orchestration & Priority Workloads</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="h-9 text-[9px] font-headline uppercase border-border/50" onClick={handleManualTrigger}>
             <RefreshCcw className={cn("h-3.5 w-3.5 mr-2", isRefreshing && "animate-spin")} /> 
             Refresh Mesh
           </Button>
           <Button className="h-9 text-[9px] font-headline uppercase molten-glow">
             <Bot className="h-3.5 w-3.5 mr-2" /> Scale Agent Swarm
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { label: "Active Pool", val: stats.totalAgents.toString(), icon: Users, color: "text-primary" },
           { label: "Execution Queue", val: stats.queueDepth.toString(), icon: Layers, color: "text-blue-500" },
           { label: "Mesh Capacity", val: "84%", icon: Activity, color: "text-orange-500" },
           { label: "Success Rate", val: "99.9%", icon: ShieldCheck, color: "text-green-500" },
         ].map((stat, i) => (
           <Card key={i} className="bg-card border-border border-b-2 border-b-primary/20">
              <CardHeader className="p-4 pb-2">
                 <div className="flex items-center justify-between">
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                    <Badge variant="secondary" className="text-[7px] h-3 uppercase font-headline">LIVE</Badge>
                 </div>
                 <p className="text-[9px] font-headline uppercase text-muted-foreground mt-2">{stat.label}</p>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                 <span className="text-xl font-headline font-bold uppercase">{stat.val}</span>
              </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border bg-card/50">
          <CardHeader className="border-b border-border/50">
             <CardTitle className="text-xs font-headline uppercase tracking-widest flex items-center gap-2">
               <Workflow className="h-4 w-4 text-primary" />
               Distributed Intelligence Pool
             </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/30">
              {stats.agents.map((agent) => (
                <div key={agent.id} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-all">
                   <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-lg transition-all",
                        agent.status === 'busy' ? "bg-primary/10 text-primary animate-pulse" : 
                        agent.status === 'idle' ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                      )}>
                         <Cpu className="h-5 w-5" />
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                           <span className="text-xs font-headline font-bold uppercase">{agent.name}</span>
                           <Badge variant="secondary" className="text-[7px] h-3.5 px-1 font-headline uppercase">{agent.role}</Badge>
                         </div>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-[9px] font-headline text-muted-foreground uppercase">T-ID: {agent.id}</span>
                            <span className="text-[9px] font-headline text-primary font-bold uppercase">Workloads: {agent.executionCount}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-6">
                      <div className="text-right w-24">
                         <div className="flex justify-between text-[8px] font-headline uppercase mb-1">
                            <span>Logic Trace</span>
                            <span className="text-primary font-bold">{agent.status.toUpperCase()}</span>
                         </div>
                         <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <div className={cn("h-full transition-all duration-1000", agent.status === 'busy' ? "bg-primary w-full animate-pulse" : "bg-muted w-0")} />
                         </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardHeader>
             <CardTitle className="text-xs font-headline uppercase tracking-widest flex items-center gap-2">
               <Terminal className="h-4 w-4 text-primary" />
               Task Command Queue
             </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             {stats.queueDepth > 0 ? (
               <div className="space-y-3">
                 {agentOrchestrator.getMeshStats().recentTasks.map((task) => (
                   <div key={task.id} className="p-3 rounded-xl bg-black/40 border border-border/50 space-y-2">
                      <div className="flex justify-between items-center">
                         <Badge variant="outline" className="text-[7px] h-3.5 border-primary/20 text-primary uppercase">{task.priority}</Badge>
                         <span className="text-[7px] font-headline text-muted-foreground opacity-50">ID: {task.id}</span>
                      </div>
                      <p className="text-[10px] font-headline font-bold uppercase text-foreground truncate">{task.type}</p>
                      <div className="flex items-center gap-2">
                         <Loader2 className="h-3 w-3 animate-spin text-primary" />
                         <span className="text-[8px] font-headline text-muted-foreground uppercase">Processing by {task.role} Agent...</span>
                      </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-12 text-center space-y-4 border border-dashed border-border rounded-xl opacity-40">
                  <Activity className="h-8 w-8 mx-auto text-primary" />
                  <p className="text-[10px] font-headline uppercase italic">Task queue nominal. Awaiting triggers.</p>
               </div>
             )}

             <div className="pt-4 border-t border-border/30">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                   <h4 className="text-[9px] font-headline font-bold uppercase text-primary flex items-center gap-2">
                     <Brain className="h-3 w-3" />
                     Agent Strategic Moat
                   </h4>
                   <p className="text-[9px] text-muted-foreground uppercase leading-tight italic">
                     Agents are currently reacting to "Industrial Heartbeat" events. Billing-Prime has finished a revenue audit for the current cycle with 0 discrepancy found.
                   </p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
