
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Fingerprint, 
  ShieldCheck, 
  Building2, 
  Key, 
  Users, 
  Activity, 
  Lock,
  ChevronRight,
  Brain,
  Award,
  Zap,
  Star,
  Globe,
  MapPin
} from "lucide-react";
import { useFirestore, useAuth } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { cn } from "@/lib/utils";

export function IdentityHub() {
  const [profile, setProfile] = useState<any>(null);
  const db = useFirestore();
  const auth = useAuth();

  useEffect(() => {
    if (!auth?.currentUser || !db) return;
    return onSnapshot(doc(db, "users", auth.currentUser.uid), (snap) => {
      if (snap.exists()) setProfile(snap.data());
    });
  }, [auth, db]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Fingerprint className="h-24 w-24" />
          </div>
          <CardHeader>
            <CardTitle className="text-xs font-headline uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-3 w-3 text-primary" />
              SOVEREIGN TRUST
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-headline font-bold text-primary">0.9984</div>
            <p className="text-[10px] text-muted-foreground uppercase font-headline">Aggregate Swarm Integrity</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xs font-headline uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Award className="h-3 w-3 text-blue-400" />
              IDENTITY STATUS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-headline font-bold uppercase">{profile?.plan || 'UNREGISTERED'}</div>
            <p className="text-[10px] text-muted-foreground uppercase font-headline tracking-tighter">
              Enrollment: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xs font-headline uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Globe className="h-3 w-3 text-green-400" />
              REGIONAL AFFINITY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-headline font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {profile?.region || 'GLOBAL-01'}
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-headline tracking-tighter">Mesh Node: {profile?.country || 'Detected'}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" />
                Sovereign Identity Registry
              </CardTitle>
              <CardDescription className="text-[10px] font-headline">PROVISIONED SUBJECTS & ACCESS PRIVILEGES</CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] font-headline border-primary/20 text-primary uppercase">Audit: Nominal</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-black/30 border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-primary/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded bg-muted flex items-center justify-center">
                  <Lock className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-headline font-bold">{profile?.name || 'Active Operator'}</span>
                    <Badge variant="secondary" className="text-[9px] h-4 font-headline uppercase">{profile?.role || 'User'}</Badge>
                    <Badge variant="outline" className="text-[8px] h-3 px-1 font-headline uppercase border-primary/40 text-primary">{profile?.plan || 'Free'}</Badge>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-headline uppercase flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span>UID: {auth?.currentUser?.uid?.slice(0, 12)}...</span>
                    <span>EMAIL: {profile?.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[9px] font-headline text-muted-foreground uppercase mb-1">Execution Trust</div>
                  <div className="flex items-center gap-2">
                    <Progress value={98} className="h-1.5 w-24 bg-muted" />
                    <span className="text-xs font-headline font-bold text-primary">98%</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
