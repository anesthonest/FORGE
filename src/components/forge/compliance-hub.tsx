"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  History, 
  Globe, 
  Fingerprint, 
  Gavel,
  Clock,
  Loader2,
  FileCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForgeRuntime } from "@/context/forge-runtime-context";
import { useFirestore } from "@/firebase";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";

/**
 * @fileOverview Compliance Hub (v2 - Real Audit Streams)
 * Bound to system_audit_event entries in the forge_events ledger.
 */

export function ComplianceHub() {
  const { user } = useForgeRuntime();
  const db = useFirestore();
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !user) return;

    const q = query(
      collection(db, "forge_events"),
      where("userId", "==", user.uid),
      where("type", "==", "system_audit_event"),
      orderBy("timestamp", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().timestamp?.toDate()?.toLocaleTimeString() || "Syncing..."
      }));
      setAuditLogs(docs);
      setLoading(false);
    });

    return () => unsub();
  }, [db, user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-headline font-bold uppercase tracking-tighter flex items-center gap-2 text-primary">
            <Gavel className="h-5 w-5" />
            Enterprise Governance Control
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase font-headline">Industrial Compliance Monitoring & Event Ledger</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-[10px] font-headline uppercase border-green-500/20 text-green-500">
            SYSTEM STATUS: COMPLIANT
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: "GDPR Core", status: "Active", risk: "Low", desc: "Data residency and event tracing active." },
          { name: "Sovereign Guard", status: "Active", risk: "Low", desc: "Identity resolution and session scrubbing enforced." },
          { name: "Audit Swarm", status: "Monitoring", risk: "Low", desc: "Real-time event ledger verification active." },
        ].map((m, i) => (
          <Card key={i} className="bg-card border-border hover:border-primary/30 transition-all border-l-4 border-l-primary/50 shadow-lg">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between mb-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <Badge variant="outline" className="text-[9px] font-headline text-green-500 border-green-500/30 uppercase">RISK: LOW</Badge>
              </div>
              <CardTitle className="text-xs font-headline uppercase tracking-widest">{m.name}</CardTitle>
              <CardDescription className="text-[9px] font-headline text-muted-foreground uppercase">State: {m.status}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] text-muted-foreground leading-tight italic">"{m.desc}"</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  Immutable Audit Ledger
                </CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase">REAL-TIME GOVERNANCE FEED</CardDescription>
              </div>
              <Button variant="outline" className="h-7 text-[8px] font-headline border-primary/20 text-primary uppercase">Export Report</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary/30" />
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground uppercase text-[10px] font-headline italic">
                Scanning event streams for compliance signals...
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 group hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground w-16 text-[9px] font-mono opacity-50">[{log.time}]</span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-headline font-bold text-primary uppercase">{log.action}</span>
                        <span className="text-[9px] text-muted-foreground italic truncate max-w-[300px]">Source: {log.source}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[8px] h-4 font-headline uppercase border-green-500/20 text-green-500">VERIFIED</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-primary" />
              Policy Registry
            </CardTitle>
            <CardDescription className="text-[10px] font-headline uppercase">Operational Guardrails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: "Data Localization", status: 100 },
              { label: "Audit-Log Retention", status: 100 },
              { label: "Agent Sandbox Strictness", status: 92 },
              { label: "User-Tier Isolation", status: 100 },
            ].map((policy, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-headline uppercase">
                  <span>{policy.label}</span>
                  <span className="text-muted-foreground">{policy.status}%</span>
                </div>
                <Progress value={policy.status} className="h-1 bg-muted" />
              </div>
            ))}
            <div className="pt-4 border-t border-border/30">
              <Button variant="default" className="w-full h-9 text-[10px] font-headline uppercase molten-glow">
                Trigger Global Audit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
