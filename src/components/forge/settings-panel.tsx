"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  User, 
  ShieldCheck, 
  Zap, 
  Bell, 
  Key, 
  Activity, 
  BrainCircuit, 
  Palette, 
  Save, 
  Loader2, 
  Globe, 
  Lock,
  RefreshCcw,
  ShieldAlert
} from "lucide-react";
import { useForgeRuntime } from "@/context/forge-runtime-context";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  const { profile, user } = useForgeRuntime();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    autonomyLevel: 2,
    lowCostMode: false,
    notifications: true,
    regionalResidency: "US-EAST",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        autonomyLevel: profile.autonomyLevel || 2,
        lowCostMode: profile.lowCostMode || false,
        notifications: profile.notifications ?? true,
        regionalResidency: profile.region || "US-EAST",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user || !db) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...formData,
        lastUpdated: serverTimestamp(),
      });
      toast({
        title: "Settings Synchronized",
        description: "Your system preferences have been updated across the mesh.",
      });
    } catch (err) {
      console.error("[FORGE-SETTINGS] Synchronization fault:", err);
      toast({
        variant: "destructive",
        title: "Synchronization Fault",
        description: "Unable to commit changes to the sovereign ledger.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-headline font-bold uppercase tracking-tighter flex items-center gap-3 italic">
            <Settings className="h-6 w-6 text-primary" />
            System Configuration
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase font-headline">Enterprise Governance & Operator Preferences</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="h-10 px-8 font-headline text-[10px] uppercase molten-glow"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Sync Preferences</>}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-muted/30 border border-border/50 p-1 h-12 rounded-xl mb-8">
          <TabsTrigger value="profile" className="text-[10px] font-headline uppercase px-6 h-full flex gap-2">
            <User className="h-3.5 w-3.5" /> Identity
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-[10px] font-headline uppercase px-6 h-full flex gap-2">
            <BrainCircuit className="h-3.5 w-3.5" /> Autonomy
          </TabsTrigger>
          <TabsTrigger value="security" className="text-[10px] font-headline uppercase px-6 h-full flex gap-2">
            <ShieldCheck className="h-3.5 w-3.5" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-[10px] font-headline uppercase px-6 h-full flex gap-2">
            <Bell className="h-3.5 w-3.5" /> Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Operator Identity
              </CardTitle>
              <CardDescription className="text-[10px] font-headline uppercase">Managed Identity Context</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-headline uppercase text-muted-foreground">Operator Name</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-black/20 border-border font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-headline uppercase text-muted-foreground">Primary Context (Email)</Label>
                  <Input 
                    value={formData.email}
                    disabled
                    className="bg-black/40 border-border font-body opacity-60"
                  />
                </div>
              </div>
              <div className="pt-4 space-y-2">
                <Label className="text-[10px] font-headline uppercase text-muted-foreground">Regional Residency</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['US-EAST', 'EU-WEST', 'APAC-SOUTH', 'AF-CENTRAL'].map((r) => (
                    <Button 
                      key={r}
                      variant="outline" 
                      onClick={() => setFormData({...formData, regionalResidency: r})}
                      className={cn(
                        "h-9 text-[9px] font-headline uppercase border-border/50",
                        formData.regionalResidency === r && "border-primary text-primary bg-primary/5"
                      )}
                    >
                      <Globe className="h-3 w-3 mr-2" /> {r}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-primary" />
                Intelligence Governance
              </CardTitle>
              <CardDescription className="text-[10px] font-headline uppercase">Autonomous Execution Control Plane</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-headline font-bold uppercase">Autonomy Level</h4>
                    <p className="text-[10px] text-muted-foreground uppercase">Control the system's self-healing and task-detection threshold.</p>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/20">LEVEL {formData.autonomyLevel}</Badge>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((lvl) => (
                    <Button
                      key={lvl}
                      variant="outline"
                      onClick={() => setFormData({...formData, autonomyLevel: lvl})}
                      className={cn(
                        "flex flex-col h-16 border-border/50 transition-all",
                        formData.autonomyLevel === lvl && "border-primary bg-primary/10 shadow-[0_0_15px_rgba(255,107,0,0.1)]"
                      )}
                    >
                      <span className="text-sm font-headline font-bold">{lvl}</span>
                      <span className="text-[7px] font-headline uppercase text-muted-foreground">
                        {lvl === 0 ? "Manual" : lvl === 1 ? "Assisted" : lvl === 2 ? "Semi-Auto" : "Full-Auto"}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-primary/10 text-primary">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-headline font-bold uppercase">Low-Cost Execution Mode</h4>
                    <p className="text-[8px] text-muted-foreground uppercase">Prioritize speed and cost over reasoning depth.</p>
                  </div>
                </div>
                <Switch 
                  checked={formData.lowCostMode}
                  onCheckedChange={(v) => setFormData({...formData, lowCostMode: v})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card/50 border-border border-t-4 border-t-red-500">
            <CardHeader>
              <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
                <Lock className="h-4 w-4 text-red-500" />
                Sovereign Security & API
              </CardTitle>
              <CardDescription className="text-[10px] font-headline uppercase">Managed Access Keys & Encryption</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-headline uppercase text-muted-foreground">Platform API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    value="sk_forge_live_••••••••••••••••"
                    disabled
                    className="bg-black/40 border-border font-mono text-xs opacity-60"
                  />
                  <Button variant="outline" className="h-10 text-[9px] font-headline uppercase border-border/50">Regenerate</Button>
                </div>
                <p className="text-[8px] text-red-500/80 uppercase font-headline italic">Caution: Regenerating keys will disconnect active mesh nodes.</p>
              </div>

              <div className="pt-6 border-t border-border/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-headline font-bold uppercase">Multi-Factor Fabric</h4>
                    <p className="text-[10px] text-muted-foreground uppercase">Require biometric authentication for deployment swarms.</p>
                  </div>
                  <Switch checked={true} disabled />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-headline font-bold uppercase">Encryption at Rest</h4>
                    <p className="text-[10px] text-muted-foreground uppercase">Force AES-256 for all persistent cognitive memory.</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-none text-[8px] font-headline">ENFORCED</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Operational Telemetry Alerts
              </CardTitle>
              <CardDescription className="text-[10px] font-headline uppercase">Real-time Swarm & Deployment Status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Deployment Success", ok: true },
                { label: "Critical Failures", ok: true },
                { label: "Quota Warnings", ok: true },
                { label: "Weekly Productivity Sync", ok: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-border/50">
                  <span className="text-[10px] font-headline uppercase font-bold">{item.label}</span>
                  <Switch checked={item.ok} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-border bg-muted/10 border-dashed">
        <CardContent className="p-8 text-center space-y-4">
          <ShieldAlert className="h-10 w-10 text-muted-foreground/30 mx-auto" />
          <div>
            <h3 className="text-sm font-headline font-bold uppercase">Sovereign Data Export</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-headline leading-relaxed mt-1 max-w-md mx-auto">
              Download your entire cognitive history, workflow manifests, and deployment logs in an encrypted ZIP archive for institutional review.
            </p>
          </div>
          <Button variant="outline" className="h-9 text-[10px] font-headline uppercase border-border/50 rounded-xl px-8">
            Request Data Manifest
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
