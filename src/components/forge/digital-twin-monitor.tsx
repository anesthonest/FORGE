
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Box, 
  Activity, 
  Zap, 
  AlertTriangle, 
  RefreshCcw, 
  Users, 
  Database,
  Globe,
  Lock,
  Play,
  Flame,
  Bug
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { cn } from "@/lib/utils";
import { DigitalTwinEngine } from "@/lib/digital-twin-engine";
import { FailureEngine } from "@/lib/failure-engine";

const simulationData = [
  { time: '00:00', load: 120, latency: 22 },
  { time: '05:00', load: 450, latency: 28 },
  { time: '10:00', load: 890, latency: 45 },
  { time: '15:00', load: 1240, latency: 82 },
  { time: '20:00', load: 1800, latency: 145 },
  { time: '25:00', load: 900, latency: 60 },
  { time: '30:00', load: 400, latency: 32 },
];

export function DigitalTwinMonitor() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [load, setLoad] = useState(42);
  const [crashProb, setCrashProb] = useState(0.05);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        const nextLoad = Math.floor(Math.random() * 100);
        setLoad(nextLoad);
        setCrashProb(FailureEngine.predictCrashProbability(nextLoad, 0.4));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isSimulating]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border hover:border-primary/30 transition-all">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <Box className="h-4 w-4 text-primary" />
              <Badge variant="outline" className={cn(
                "text-[8px] h-4 font-headline uppercase",
                isSimulating ? "text-primary animate-pulse border-primary/40" : "text-muted-foreground"
              )}>
                {isSimulating ? "RUNNING SIM" : "IDLE"}
              </Badge>
            </div>
            <CardTitle className="text-xs font-headline uppercase mt-3 tracking-widest">Shadow Replica: Core-V1</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-headline font-bold text-foreground">98.4% FIDELITY</div>
            <p className="text-[9px] text-muted-foreground uppercase font-headline">Last production sync: 12m ago</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="p-4">
            <Users className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-xs font-headline uppercase mt-3 tracking-widest">Traffic Emulation</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-headline font-bold text-foreground">{load * 120} USERS</div>
            <Progress value={load} className="h-1 bg-muted mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="p-4">
            <Flame className="h-4 w-4 text-orange-500" />
            <CardTitle className="text-xs font-headline uppercase mt-3 tracking-widest">Crash Probability</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className={cn(
              "text-xl font-headline font-bold",
              crashProb > 0.5 ? "text-red-500" : "text-green-500"
            )}>{(crashProb * 100).toFixed(1)}%</div>
            <p className="text-[9px] text-muted-foreground uppercase font-headline">Status: {crashProb > 0.5 ? "DANGER" : "NOMINAL"}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-l-4 border-l-primary/50">
          <CardHeader className="p-4">
            <Play className="h-4 w-4 text-primary" />
            <CardTitle className="text-xs font-headline uppercase mt-3 tracking-widest">Sim Control</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Button 
              onClick={toggleSimulation}
              variant={isSimulating ? "destructive" : "default"} 
              className="w-full h-8 text-[10px] font-headline uppercase tracking-tighter"
            >
              {isSimulating ? "ABORT SIMULATION" : "INITIALIZE TWIN"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border bg-card/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Twin Telemetry & Load Patterns
                </CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase">PREDICTIVE ANALYTICS IN SHADOW ENVIRONMENT</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-headline border-primary/20 text-primary">SCALE TEST: PASS</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulationData}>
                  <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.3)" />
                  <XAxis dataKey="time" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontSize: '10px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="load" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorLoad)" />
                  <Line type="monotone" dataKey="latency" stroke="hsl(var(--blue-500))" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
              <Bug className="h-4 w-4 text-primary" />
              Chaos Injector
            </CardTitle>
            <CardDescription className="text-[10px] font-headline uppercase">FAILURE SCENARIO TESTING</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded bg-red-500/5 border border-red-500/20">
              <p className="text-[10px] font-headline font-bold text-red-500 uppercase mb-2">Simulated Outages</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "Kill API Gateway", impact: "CRITICAL" },
                  { label: "Corrupt DB Node", impact: "HIGH" },
                  { label: "Region Latency +500ms", impact: "MEDIUM" },
                  { label: "Auth Provider Down", impact: "CRITICAL" },
                ].map((chaos, i) => (
                  <Button key={i} variant="outline" className="h-7 text-[8px] justify-between border-red-500/10 hover:bg-red-500/10 font-headline">
                    {chaos.label}
                    <Badge className="h-3 text-[7px] bg-red-500/20 text-red-500 border-none">{chaos.impact}</Badge>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/30">
              <div className="flex justify-between items-center text-[10px] font-headline uppercase">
                <span>Self-Healing Confidence</span>
                <span className="text-green-500">92%</span>
              </div>
              <Progress value={92} className="h-1 bg-muted" />
              <p className="text-[8px] text-muted-foreground uppercase leading-tight italic">
                Platform agents predicted and mitigated 4 simulated outages in the last 10 minutes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
            <RefreshCcw className="h-4 w-4 text-primary" />
            Shadow Execution Trace
          </CardTitle>
          <CardDescription className="text-[10px] font-headline uppercase">DETERMINISTIC REPLAY OF SIMULATED EVENTS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { time: "T-01:42", event: "LOAD_SPIKE_DETECTED", target: "Shadow-API-V1", status: "Scaling...", val: "+12 Nodes" },
              { time: "T-01:45", event: "CHAOS_INJECTION", target: "Auth-Service", status: "Failing", val: "503 Error" },
              { time: "T-01:46", event: "HEALING_PROTOCOL", target: "Warden-Agent", status: "Recovered", val: "Rerouted: Auth-Backup" },
              { time: "T-01:50", event: "SIM_SNAPSHOT_COMPLETE", target: "Registry", status: "Success", val: "Checkpointed" },
            ].map((trace, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded bg-black/30 border border-border/50 text-[10px] font-headline group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground opacity-50">{trace.time}</span>
                  <span className="font-bold text-primary">{trace.event}</span>
                  <span className="text-muted-foreground italic truncate">Target: {trace.target}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground font-bold">{trace.val}</span>
                  <Badge variant="outline" className={cn(
                    "text-[8px] h-4 uppercase",
                    trace.status === 'Recovered' ? "text-green-500 border-green-500/20" : "text-primary border-primary/20"
                  )}>{trace.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
