"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid,
  Bar,
  BarChart,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUpRight, PieChart, Loader2, DollarSign, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Revenue Intelligence Charts (Industrial Telemetry v5)
 * Wired to real-time industrial revenue telemetry derived from the event ledger.
 */

export function RevenueCharts() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch('/api/analytics/revenue');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (e) {
        console.error("Revenue fetch fault.");
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  if (loading) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4 bg-card/20 border border-dashed border-border rounded-3xl">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
        <p className="text-[10px] font-headline text-muted-foreground uppercase tracking-widest animate-pulse">Aggregating Economic Ledger...</p>
      </div>
    );
  }

  const metrics = data?.metrics || { mrr: 0, arr: 0, netProfit: 0, aiCosts: 0, churnRate: 0, throughput: 0 };
  const distribution = data?.distribution || [];
  const revenueStream = data?.revenueStream || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { label: "Aggregate MRR", val: `$${metrics.mrr.toLocaleString()}`, color: "text-green-500", icon: DollarSign },
           { label: "Net Margin", val: `$${metrics.netProfit.toLocaleString()}`, color: "text-primary", icon: Activity },
           { label: "Throughput", val: `${metrics.throughput} Ops`, color: "text-blue-500", icon: TrendingUp },
           { label: "Churn Velocity", val: `${metrics.churnRate.toFixed(1)}%`, color: "text-red-500", icon: Activity },
         ].map((m, i) => (
           <Card key={i} className="bg-card border-border border-b-2 border-b-primary/10">
              <CardContent className="p-4 flex flex-col items-center text-center gap-1">
                 <m.icon className={cn("h-4 w-4 mb-1", m.color)} />
                 <span className="text-[8px] font-headline uppercase text-muted-foreground">{m.label}</span>
                 <span className={cn("text-xl font-headline font-bold uppercase", m.color)}>{m.val}</span>
              </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border bg-card/50 shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="h-4 w- green-500" />
                  Subscription Scaling Flow
                </CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase">Live Revenue Velocity vs Compute Burn</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-xl font-headline font-bold text-green-500">
                  +${metrics.mrr.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[8px] font-headline text-muted-foreground uppercase flex items-center gap-1 justify-end">
                  <ArrowUpRight className="h-2.5 w-2.5" /> Projected ARR: ${metrics.arr.toLocaleString()}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueStream}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompute" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.3)" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#888888" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontSize: '10px', color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rev" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    name="Industrial Subs"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="compute" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCompute)" 
                    name="Infra Burn"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Monetization Mix
            </CardTitle>
            <CardDescription className="text-[10px] font-headline uppercase">TIER PERFORMANCE MATRIX</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
               <div className="h-[220px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distribution} layout="vertical" margin={{ left: -10 }}>
                       <XAxis type="number" hide />
                       <YAxis type="category" dataKey="name" stroke="#888888" fontSize={8} tickLine={false} axisLine={false} />
                       <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', fontSize: '10px' }} />
                       <Bar dataKey="val" radius={[0, 4, 4, 0]} fill="hsl(var(--primary))" />
                    </BarChart>
                 </ResponsiveContainer>
               </div>

               <div className="space-y-2">
                 {distribution.slice(0, 5).map((layer: any, i: number) => (
                   <div key={i} className="flex items-center justify-between p-2 rounded bg-black/30 border border-border/50 text-[9px] font-headline group hover:border-primary/40 transition-all">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                         <span className="text-muted-foreground uppercase">{layer.name}</span>
                      </div>
                      <span className="font-bold text-foreground">{layer.val.toFixed(1)}%</span>
                   </div>
                 ))}
               </div>

               <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <h4 className="text-[9px] font-headline font-bold uppercase text-primary mb-1 flex items-center gap-2">
                    <DollarSign className="h-3 w-3" /> Profit Strategy
                  </h4>
                  <p className="text-[8px] text-muted-foreground uppercase leading-tight italic">
                    Net profit margin is currently tracking at {((metrics.netProfit / (metrics.mrr || 1)) * 100).toFixed(1)}%. Revenue velocity suggests a {metrics.churnRate > 5 ? 'retention' : 'growth'} focus is required for this cycle.
                  </p>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
