"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Coins, 
  TrendingUp, 
  Zap, 
  History, 
  Activity, 
  Wallet, 
  ArrowUpCircle, 
  Loader2,
  PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForgeRuntime } from "@/context/forge-runtime-context";
import { useWalletStore } from "@/stores/wallet-store";
import { getClientFirebase } from "@/lib/firebase/client";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";

/**
 * @fileOverview Economy Hub (Projected from Ledger)
 * Derives real-time wallet history and resource load from forge_events.
 */

export function EconomyHub() {
  const runtime = useForgeRuntime();
  const wallet = useWalletStore();
  const { balance, cvuCredits, spent, earned } = wallet;
  const { user } = runtime;

  const [ecoEvents, setEcoEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // REAL-TIME LEDGER LISTENER
  useEffect(() => {
    if (!user) return;
    const { db } = getClientFirebase();
    if (!db) return;

    const q = query(
      collection(db, "forge_events"),
      where("uid", "==", user.uid),
      where("type", "in", ["wallet_transaction", "ai_execution", "subscription_update", "marketplace_action"]),
      orderBy("timestamp", "desc"),
      limit(15)
    );

    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          time: data.timestamp?.toDate()?.toLocaleTimeString() || "Pending..."
        };
      });
      setEcoEvents(docs);
      setLoadingEvents(false);
    });

    return () => unsub();
  }, [user]);

  const stats = [
    { label: "Sovereign Balance", val: `$${balance.toFixed(2)}`, icon: Wallet, color: "text-green-500" },
    { label: "Compute Pool (CVU)", val: cvuCredits.toLocaleString(), icon: Coins, color: "text-orange-500" },
    { label: "Total Economic Spend", val: `$${spent.toFixed(2)}`, icon: Zap, color: "text-blue-500" },
    { label: "Outcome Value", val: `$${earned.toFixed(2)}`, icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-border hover:border-primary/30 transition-all border-b-2 border-b-primary/10 shadow-lg">
            <CardHeader className="p-4 pb-2">
              <stat.icon className={cn("h-4 w-4", stat.color)} />
              <p className="text-[9px] font-headline uppercase text-muted-foreground mt-2">{stat.label}</p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <span className="text-xl font-headline font-bold uppercase">{stat.val}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border bg-card/50 shadow-xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2 text-primary">
                  <Activity className="h-4 w-4 text-primary" />
                  Resource Liquidity Matrix
                </CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase">COMPUTE VALUE UNIT SETTLEMENT</CardDescription>
              </div>
              <Button size="sm" className="h-8 text-[9px] font-headline uppercase molten-glow">
                <ArrowUpCircle className="h-3.5 w-3.5 mr-2" /> Purchase Credits
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-headline uppercase font-bold">
                        <span className="text-muted-foreground">Compute Pool Capacity</span>
                        <span className="text-primary">{((cvuCredits / 1000) * 100).toFixed(1)}%</span>
                     </div>
                     <Progress value={(cvuCredits / 1000) * 100} className="h-1.5 bg-muted" />
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                     <h4 className="text-[10px] font-headline font-bold uppercase text-primary mb-2 flex items-center gap-2">
                        <Zap className="h-3 w-3" />
                        Economic Advice
                     </h4>
                     <p className="text-[10px] text-muted-foreground uppercase leading-relaxed italic">
                       "Operator compute intensity is 14% higher than the previous cycle. Suggest optimizing non-critical reasoning paths to preserve CVU liquidity."
                     </p>
                  </div>
               </div>
               
               <div className="flex flex-col justify-center items-center text-center p-6 bg-black/20 rounded-2xl border border-border/50">
                  <PieChart className="h-12 w-12 text-primary mb-4 opacity-50" />
                  <h4 className="text-[10px] font-headline font-bold uppercase text-foreground mb-1">Execution Mix</h4>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-widest">74% AI Reasoning | 26% System Logic</p>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 shadow-xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-black/20">
            <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2 text-primary">
              <History className="h-4 w-4 text-primary" />
              Economic Ledger
            </CardTitle>
            <CardDescription className="text-[10px] font-headline uppercase">VERIFIED FINANCIAL ACTIVITY</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[380px] overflow-y-auto custom-scrollbar">
              {loadingEvents ? (
                <div className="p-12 text-center flex flex-col items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary/30" />
                  <span className="text-[9px] font-headline uppercase text-muted-foreground">Deriving ledger state...</span>
                </div>
              ) : ecoEvents.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground uppercase text-[10px] font-headline italic opacity-30">
                  No verified transactions found.
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {ecoEvents.map((ev) => (
                    <div key={ev.id} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg bg-black/30",
                          ev.type === 'wallet_transaction' ? "text-green-500" : 
                          ev.type === 'ai_execution' ? "text-primary" : "text-blue-500"
                        )}>
                          {ev.type === 'ai_execution' ? <Zap className="h-4 w-4" /> : <Coins className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-[10px] font-headline font-bold uppercase tracking-tight">{ev.action?.replace(/_/g, ' ') || "Action"}</p>
                          <p className="text-[8px] text-muted-foreground uppercase font-headline">{ev.time} • {ev.source}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "text-[11px] font-headline font-bold",
                          ev.cost > 0 ? "text-red-500" : "text-green-500"
                        )}>
                          {ev.cost > 0 ? '-' : '+'}${Math.abs(ev.cost || 0).toFixed(4)}
                        </p>
                        {ev.resourceUsage > 0 && (
                          <p className="text-[7px] text-muted-foreground uppercase font-headline">-{ev.resourceUsage} CVU</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-black/40 p-4 border-t border-border/50">
               <Button variant="ghost" className="w-full h-8 text-[9px] font-headline uppercase text-muted-foreground hover:text-primary">
                  View Full Audit Trail
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
