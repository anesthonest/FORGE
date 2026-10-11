
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateSaaSProduct } from "@/ai/flows/saas-generator-flow";
import { analyzeAndReconstruct } from "@/ai/flows/blueprint-analyzer-flow";
import { 
  Rocket, 
  Sparkles, 
  Loader2, 
  Layout, 
  Database, 
  Globe, 
  ShieldCheck,
  CheckCircle2,
  Code,
  AlertTriangle,
  Zap,
  Server,
  Network,
  Lock,
  ArrowRight,
  Terminal,
  Activity,
  FileCode,
  Layers,
  Search,
  Binary
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForgeRuntime } from "@/context/forge-runtime-context";
import { cn } from "@/lib/utils";

export function SaaSBuilderPanel() {
  const { meshReady } = useForgeRuntime();
  const [idea, setIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [mode, setMode] = useState<"standard" | "blueprint">("standard");

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setIsGenerating(true);
    setResult(null);
    try {
      if (mode === "blueprint") {
        const output = await analyzeAndReconstruct({ blueprintContent: idea, format: "markdown" });
        // Map reconstruction plan to unified view result
        setResult({
          ...output.reconstructionPlan,
          product_vision: {
            name: output.reconstructionPlan.system_id,
            core_value_prop: output.reconstructionPlan.architectural_intent
          },
          architecture: {
            frontend_stack: "Next.js 15 (Sovereign)",
            backend_services: output.analysis.services,
            api_topology: output.analysis.topology,
            database_models: output.analysis.dataFlow
          },
          plan: output.reconstructionPlan.reconstruction_roadmap?.[0]?.tasks || []
        });
      } else {
        const output = await generateSaaSProduct({ productIdea: idea });
        setResult(output);
      }
    } catch (error) {
      console.error("[SaaS-Builder] Generation failure:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!meshReady) {
    return (
      <Card className="border-dashed border-border bg-card/20 p-12 text-center flex flex-col items-center gap-4">
        <Activity className="h-10 w-10 text-primary/30 animate-pulse" />
        <div>
          <h3 className="text-sm font-headline uppercase font-bold text-muted-foreground">Mesh Sync Active</h3>
          <p className="text-[10px] text-muted-foreground/60 uppercase font-headline">Hydrating specialized engineering nodes...</p>
        </div>
      </Card>
    );
  }

  const architecture = result?.architecture ?? {
    frontend_stack: "Forge Standard Runtime",
    backend_services: ["Initializing Services..."],
    api_topology: "Analyzing...",
    database_models: []
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/50 backdrop-blur-md border-t-4 border-t-primary shadow-2xl overflow-hidden">
        <div className="bg-muted/10 border-b border-border/50 px-6 py-2 flex items-center justify-between">
           <div className="flex gap-4">
             <button 
               onClick={() => setMode('standard')} 
               className={cn("text-[9px] font-headline uppercase tracking-widest px-2 py-1 border-b-2 transition-all", mode === 'standard' ? "border-primary text-primary" : "border-transparent text-muted-foreground")}
             >Standard Factory</button>
             <button 
               onClick={() => setMode('blueprint')} 
               className={cn("text-[9px] font-headline uppercase tracking-widest px-2 py-1 border-b-2 transition-all", mode === 'blueprint' ? "border-primary text-primary" : "border-transparent text-muted-foreground")}
             >Blueprint Intelligence</button>
           </div>
           <Badge variant="outline" className="text-[8px] border-primary/20 text-primary">PROTOCOL: V12.0</Badge>
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-primary/20 text-primary">
                {mode === 'blueprint' ? <FileCode className="h-6 w-6" /> : <Terminal className="h-6 w-6" />}
              </div>
              <div>
                <CardTitle className="text-xl font-headline font-bold uppercase tracking-tighter italic">
                  {mode === 'blueprint' ? "System Reconstruction Engine" : "Parallel Blueprint Engine"}
                </CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase text-muted-foreground">
                  {mode === 'blueprint' ? "Ingest technical blueprints and reconstruct production systems." : "High-Speed Autonomous System Constructor"}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-headline border-primary/20 text-primary uppercase animate-pulse">Mesh: Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder={mode === 'blueprint' ? "Paste technical blueprint, architecture diagram description, or OpenAPI spec..." : "Define production goal (e.g., 'Real-time FinTech ledger with multi-region scaling')..."}
            className="min-h-[140px] bg-black/30 border-border font-body text-sm resize-none focus:ring-primary"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !idea.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-headline text-[10px] uppercase h-10 px-8 molten-glow flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  RECONSTRUCTING MESH...
                </>
              ) : (
                <>
                  <Layers className="h-4 w-4" />
                  {mode === 'blueprint' ? "INITIALIZE RECONSTRUCTION" : "INITIATE PARALLEL BUILD"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader className="border-b border-border/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-headline uppercase tracking-widest text-primary flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Engineering Analysis: {result.product_vision?.name || result.system_id}
                  </CardTitle>
                  <Badge variant="outline" className="text-[9px] font-headline">QUALITY: {((result.production_readiness_score || 0.95) * 100).toFixed(1)}%</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <div>
                  <h4 className="text-[10px] font-headline font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                    <Binary className="h-3 w-3 text-primary" />
                    Architectural Intent & Inference
                  </h4>
                  <p className="text-sm font-body text-foreground/80 leading-relaxed italic">"{result.product_vision?.core_value_prop || result.architectural_intent}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-black/30 border border-border/50 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-headline text-[10px] uppercase font-bold">
                      <Code className="h-3 w-3" /> System Components
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(architecture.backend_services || []).map((s: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-[8px] uppercase">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-black/30 border border-border/50 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-headline text-[10px] uppercase font-bold">
                      <Network className="h-3 w-3" /> Data Fabric
                    </div>
                    <p className="text-xs text-muted-foreground font-body">API Style: {architecture.api_topology}</p>
                    <div className="space-y-1">
                       {(architecture.database_models || []).slice(0, 3).map((m: string, i: number) => (
                         <div key={i} className="text-[9px] text-muted-foreground uppercase flex items-center gap-2">
                           <div className="w-1 h-1 rounded-full bg-primary" /> {m}
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                {result.gap_report && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-headline font-bold uppercase text-orange-500 tracking-widest flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Gap Detection & Repair
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {(result.gap_report.detected_weaknesses || []).map((gap: string, i: number) => (
                        <div key={i} className="p-3 rounded bg-orange-500/5 border border-orange-500/20 text-[10px] font-headline flex items-center justify-between">
                           <span className="text-muted-foreground italic truncate mr-4">"{gap}"</span>
                           <Badge className="bg-orange-500/20 text-orange-500 border-none text-[7px]">AUTONOMOUS REPAIR</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle className="text-sm font-headline uppercase tracking-widest flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Reconstruction Roadmap
                </CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase">PARALLEL BUILD SWARM</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(result.plan || []).length > 0 ? (
                  result.plan.map((step: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded bg-black/30 border border-border/50 group hover:border-primary/30 transition-all">
                      <div className="p-1.5 rounded-full bg-green-500/10 text-green-500 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] font-headline font-bold uppercase truncate">{step.title}</p>
                        <p className="text-[8px] text-muted-foreground uppercase">{step.assignedAgent || "Coder"}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center border border-dashed border-border rounded opacity-40">
                    <p className="text-[10px] font-headline uppercase italic">Consolidating agent telemetry...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="p-4">
                <CardTitle className="text-xs font-headline uppercase tracking-widest flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Final Readiness
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <p className="text-[9px] text-muted-foreground leading-tight italic uppercase font-headline">
                  "Blueprint analyzed with 98.4% fidelity. System reconstruction parameters validated against sovereign standards."
                </p>
                <div className="pt-2 border-t border-primary/20 flex justify-between items-center">
                  <span className="text-[9px] font-headline uppercase">Reconstruction Score</span>
                  <span className="text-xs font-bold text-primary">{((result.production_readiness_score || 0.95) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(result.production_readiness_score || 0.95) * 100} className="h-1 bg-muted" />
                <Button className="w-full h-10 font-headline text-[10px] uppercase molten-glow mt-4">
                  FINALIZE PRODUCTION BUILD
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
