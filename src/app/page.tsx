"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { ForgeSidebar } from "@/components/forge/forge-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeErrorBoundary } from "@/components/ui/safe-error-boundary";
import { ChevronRight, Rocket, Activity, Terminal, ShieldCheck, Loader2 } from "lucide-react";
import { useForgeRuntime } from "@/context/forge-runtime-context";
import { cn } from "@/lib/utils";
import { ForgeLogo } from "@/components/forge/brand-identity";

// PRODUCTION-READY MODULE HYDRATION
const OrchestratorPanel = dynamic(() => import("@/components/forge/orchestrator-panel").then(m => m.OrchestratorPanel), { loading: () => <Skeleton className="h-96 rounded-3xl" /> });
const SwarmMonitor = dynamic(() => import("@/components/forge/swarm-monitor").then(m => m.SwarmMonitor), { loading: () => <Skeleton className="h-96 rounded-3xl" /> });
const MarketplacePortal = dynamic(() => import("@/components/forge/marketplace-portal").then(m => m.MarketplacePortal), { loading: () => <Skeleton className="h-96 rounded-3xl" /> });
const EconomyHub = dynamic(() => import("@/components/forge/economy-hub").then(m => m.EconomyHub), { loading: () => <Skeleton className="h-96 rounded-3xl" /> });
const PaymentPortal = dynamic(() => import("@/components/forge/payment-portal").then(m => m.PaymentPortal), { loading: () => <Skeleton className="h-96 rounded-3xl" /> });
const LiveBuildView = dynamic(() => import("@/components/forge/live-build-view").then(m => m.LiveBuildView), { loading: () => <Skeleton className="h-96 rounded-3xl" /> });
const DeploymentOSMonitor = dynamic(() => import("@/components/forge/deployment-os-monitor").then(m => m.DeploymentOSMonitor), { loading: () => <Skeleton className="h-96 rounded-3xl" /> });
const ComplianceHub = dynamic(() => import("@/components/forge/compliance-hub").then(m => m.ComplianceHub), { loading: () => <Skeleton className="h-96 rounded-3xl" /> });
const AgentPoolView = dynamic(() => import("@/components/forge/agent-pool-view").then(m => m.AgentPoolView), { loading: () => <Skeleton className="h-96 rounded-3xl" /> });
const SettingsPanel = dynamic(() => import("@/components/forge/settings-panel").then(m => m.SettingsPanel), { loading: () => <Skeleton className="h-96 rounded-3xl" /> });
const OperationsCenter = dynamic(() => import("@/components/forge/operations-center").then(m => m.OperationsCenter), { loading: () => <Skeleton className="h-96 rounded-3xl" /> });
const AuthModal = dynamic(() => import("@/components/auth/auth-modal").then(m => m.AuthModal));

export default function Dashboard() {
  const runtime = useForgeRuntime();
  const [isAuthOpen, setIsAuthModalOpen] = useState(false);

  const { 
    user,
    activeView, 
    navigate,
    meshState,
    bootStage
  } = runtime;

  useEffect(() => {
    if (bootStage === 'STABLE' && !user) {
      setIsAuthModalOpen(true);
    }
  }, [bootStage, user]);

  const handleNavigate = useCallback((view: string) => {
    navigate(view);
  }, [navigate]);

  const activeContent = useMemo(() => {
    if (!user) return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center gap-6 opacity-40">
        <ForgeLogo iconOnly className="h-16 w-16" />
        <div>
          <h2 className="text-xl font-headline font-bold uppercase">Authorization Required</h2>
          <p className="text-[10px] uppercase font-headline">Please provision your identity to access the fabrication mesh.</p>
        </div>
        <Button onClick={() => setIsAuthModalOpen(true)} className="molten-glow font-headline text-[10px] uppercase h-10 px-8">Provision Identity</Button>
      </div>
    );

    switch (activeView) {
      case 'orchestrator': return <OrchestratorPanel />;
      case 'swarm': return <SwarmMonitor />;
      case 'agents': return <AgentPoolView />;
      case 'deployment': return <DeploymentOSMonitor />;
      case 'compliance': return <ComplianceHub />;
      case 'marketplace': return <MarketplacePortal />;
      case 'economy': return <EconomyHub />;
      case 'settlement': return <PaymentPortal />;
      case 'settings': return <SettingsPanel />;
      case 'operations': return <OperationsCenter />;
      case 'dashboard':
      default: return (
        <Tabs defaultValue="build" className="w-full">
          <div className="flex items-center justify-between mb-8">
            <TabsList className="bg-muted/30 border border-border/50 h-auto p-1.5 rounded-xl">
              <TabsTrigger value="build" className="text-[10px] font-headline uppercase px-5 py-2.5 flex gap-2">
                <Rocket className="h-3.5 w-3.5" /> Production
              </TabsTrigger>
              <TabsTrigger value="orchestrator" className="text-[10px] font-headline uppercase px-5 py-2.5 flex gap-2">
                <Terminal className="h-3.5 w-3.5" /> AI Console
              </TabsTrigger>
              <TabsTrigger value="swarm" className="text-[10px] font-headline uppercase px-5 py-2.5 flex gap-2">
                <Activity className="h-3.5 w-3.5" /> Telemetry
              </TabsTrigger>
            </TabsList>
            
            {meshState === 'syncing' && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20 animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <span className="text-[9px] font-headline text-primary uppercase font-bold tracking-widest">Mesh Synchronizing...</span>
              </div>
            )}
          </div>

          <TabsContent value="build">
            <LiveBuildView goal="Sovereign-SaaS-Production" />
          </TabsContent>
          <TabsContent value="orchestrator">
            <OrchestratorPanel />
          </TabsContent>
          <TabsContent value="swarm">
            <SwarmMonitor />
          </TabsContent>
        </Tabs>
      );
    }
  }, [user, activeView, meshState]);

  return (
    <SidebarProvider>
      <ForgeSidebar activeView={activeView} onNavigate={handleNavigate} />
      <SidebarInset className="bg-background forge-grid h-screen flex flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2 text-[10px] font-headline text-muted-foreground uppercase tracking-widest">
              <ForgeLogo iconOnly className="h-5 w-5" />
              <span>Sovereign-Fabric</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{activeView.toUpperCase()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className={cn(
              "text-[8px] h-4 font-headline uppercase border-primary/30 text-primary",
              meshState === 'ready' ? "opacity-100" : "opacity-40 animate-pulse"
            )}>
              {meshState === 'ready' ? "STABLE" : "SYNCING"}
            </Badge>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-headline text-sm font-bold molten-glow text-primary-foreground">
              {user?.email?.[0].toUpperCase() || "O"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-8 max-w-7xl mx-auto w-full scroll-smooth">
          <SafeErrorBoundary>
            <Suspense fallback={<Skeleton className="h-full w-full rounded-3xl" />}>
              <div key={activeView} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeContent}
              </div>
            </Suspense>
          </SafeErrorBoundary>
        </main>

        <footer className="h-10 border-t border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 text-[8px] font-headline text-muted-foreground uppercase tracking-[0.2em] shrink-0">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 font-bold">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full shadow-[0_0_8px]",
                meshState === 'ready' ? "bg-green-500 shadow-green-500/50" : "bg-blue-500 shadow-blue-500/50 animate-pulse"
              )} /> 
              MESH: {meshState.toUpperCase()}
            </span>
            <span>Forge OS © 2026 VINEXSAH TECHNOLOGIES</span>
          </div>
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-3 w-3 text-primary" />
            <span className="text-primary font-bold">SOVEREIGN-CERTIFIED</span>
          </div>
        </footer>
      </SidebarInset>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthModalOpen(false)} />
    </SidebarProvider>
  );
}
