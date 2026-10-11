"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Terminal as TerminalIcon, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Loader2,
  Zap,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForgeRuntime } from "@/context/forge-runtime-context";
import { getClientFirebase } from "@/lib/firebase/client";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";

/**
 * @fileOverview Swarm Monitor (Event-Driven projection)
 * Derives operational traces directly from the forge_events ledger.
 */

export function SwarmMonitor() {
  const { user } = useForgeRuntime();
  const [activeLogs, setActiveLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const { db } = getClientFirebase();
    if (!db) return;

    // PROJECTED EVENT QUERY (UID-SCOPED)
    const q = query(
      collection(db, "forge_events"),
      where("uid", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(30)
    );

    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          time: data.timestamp?.toDate()?.toLocaleTimeString() || "Pending...",
          agent: data.source || "Kernel",
          type: data.type,
          action: data.action,
          msg: data.metadata?.message || `Executed ${data.action}`,
          cost: data.cost || 0
        };
      });
      setActiveLogs(docs);
      setLoading(false);
    }, (err) => {
      console.error("[FORGE-MONITOR] Event sync failed:", err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const stats = [
    { label: "Active Nodes", val: "6/6", icon: Users, color: "text-primary" },
    { label: "Global Pulse", val: activeLogs.length.toString(), icon: Zap, color: "text-green-500" },
    { label: "Sync Latency", val: "15ms", icon: Activity, color: "text-blue-500" },
    { label: "Ledger Integrity", val: "1.00", icon: ShieldCheck, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-border border-b-2 border-b-primary/20">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <stat.icon className={cn("h-4 w-4", stat.color)} />
                <Badge variant="secondary" className="text-[7px] h-3 uppercase font-headline">Live Projection</Badge>
              </div>
              <p className="text-[9px] font-headline uppercase text-muted-foreground mt-2">{stat.label}</p>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <span className="text-xl font-headline font-bold uppercase">{stat.val}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border overflow-hidden shadow-2xl">
        <CardHeader className="border-b border-border/50 bg-black/20 flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded bg-primary/10 text-primary">
                <TerminalIcon className="h-5 w-5" />
             </div>
             <div>
                <CardTitle className="text-sm font-headline tracking-widest uppercase">Industrial Event Bus</CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase">REAL-TIME OPERATIONAL TRACE LEDGER</CardDescription>
             </div>
          </div>
          <div className="flex gap-2">
             <Badge variant="outline" className="text-green-500 border-green-500/20 font-headline uppercase text-[8px] animate-pulse">SOVEREIGN-SYNC: ONLINE</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[450px] overflow-y-auto bg-black/40 p-6 font-code text-[10px] space-y-3 custom-scrollbar">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 opacity-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-[10px] font-headline uppercase tracking-widest">Hydrating from mesh ledger...</span>
              </div>
            ) : activeLogs.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground uppercase italic opacity-30 font-headline">
                <History className="h-10 w-10 mx-auto mb-4" />
                No events recorded in this cycle.
              </div>
            ) : (
              activeLogs.map((log) => (
                <div key={log.id} className="flex gap-4 group hover:bg-white/5 p-2 rounded-lg border border-transparent hover:border-border/50 transition-all">
                  <span className="text-muted-foreground whitespace-nowrap opacity-50 font-mono">[{log.time}]</span>
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <span className={cn(
                      "font-bold uppercase px-1.5 py-0.5 rounded-[4px]",
                      log.type === 'ai_execution' ? "bg-primary/10 text-primary" : 
                      log.type === 'wallet_transaction' ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                    )}>
                      {log.agent}
                    </span>
                  </div>
                  <span className="text-foreground/80 flex-1 truncate font-medium">
                    <span className="text-muted-foreground mr-2 opacity-50 italic">→</span>
                    {log.msg}
                  </span>
                  {log.cost > 0 && <span className="text-red-500/80 font-bold">-${log.cost.toFixed(4)}</span>}
                  <div className="w-2 h-2 rounded-full bg-green-500/40 mt-1 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                </div>
              ))
            )}
            <div className="flex gap-4 items-center pl-2 pt-2">
              <span className="text-primary animate-pulse font-bold">_</span>
              <span className="text-[8px] text-muted-foreground/30 uppercase tracking-[0.3em]">Awaiting Mesh Pulse...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
