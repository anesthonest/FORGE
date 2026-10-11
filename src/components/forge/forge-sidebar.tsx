"use client";

import * as React from "react";
import { 
  LayoutDashboard, 
  Settings, 
  BarChart3,
  Package,
  Activity,
  Puzzle,
  Terminal,
  Search,
  Gavel,
  Rocket,
  Users,
  Wallet,
  PieChart,
  Lock,
  Zap,
  Globe,
  Scale
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useForgeRuntime } from "@/context/forge-runtime-context";
import { FORGE_PLANS, SubscriptionTier } from "@/lib/billing-engine";
import { ForgeLogo } from "./brand-identity";

interface NavItem {
  id: string;
  title: string;
  icon: any;
  tierRequired: SubscriptionTier;
  enterpriseOnly?: boolean;
}

const mainNav: NavItem[] = [
  { id: "dashboard", title: "Overview", icon: LayoutDashboard, tierRequired: 'free' },
  { id: "orchestrator", title: "AI Console", icon: Terminal, tierRequired: 'free' },
  { id: "operations", title: "Ops Center", icon: Activity, tierRequired: 'pro' },
  { id: "marketplace", title: "Marketplace", icon: Package, tierRequired: 'free' },
  { id: "economy", title: "Wallet & CVU", icon: Wallet, tierRequired: 'free' },
  { id: "settlement", title: "Billing", icon: PieChart, tierRequired: 'free' },
  { id: "agents", title: "Agent Mesh", icon: Users, tierRequired: 'premium' },
  { id: "swarm", title: "Workflows", icon: Activity, tierRequired: 'premium' },
  { id: "analytics", title: "Analytics", icon: BarChart3, tierRequired: 'pro' },
  { id: "investor", title: "Investor Intel", icon: Scale, tierRequired: 'elite' },
  { id: "deployment", title: "Deployment OS", icon: Rocket, tierRequired: 'premium' },
  { id: "plugins", title: "Plugin Manager", icon: Puzzle, tierRequired: 'pro' },
  { id: "compliance", title: "Compliance Hub", icon: Gavel, tierRequired: 'elite' },
  { id: "global-mesh", title: "Global Mesh", icon: Globe, tierRequired: 'ent_pro', enterpriseOnly: true },
  { id: "settings", title: "System Settings", icon: Settings, tierRequired: 'free' },
  { id: "admin", title: "Logs Dashboard", icon: Search, tierRequired: 'elite' },
];

interface ForgeSidebarProps {
  onNavigate: (view: string) => void;
  activeView: string;
}

export function ForgeSidebar({ onNavigate, activeView }: ForgeSidebarProps) {
  const { state } = useSidebar();
  const { profile } = useForgeRuntime();
  const currentTier = (profile?.plan || 'free') as SubscriptionTier;

  const isTierGreaterOrEqual = (current: SubscriptionTier, required: SubscriptionTier) => {
    const tiers: SubscriptionTier[] = ['free', 'pro', 'premium', 'elite', 'ent_pro', 'ent_premium', 'ent_elite'];
    return tiers.indexOf(current) >= tiers.indexOf(required);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <ForgeLogo iconOnly className="h-8 w-8 flex-shrink-0" />
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="font-headline font-bold text-lg tracking-tighter uppercase leading-none italic text-primary">Forge OS</span>
              <span className="text-[7px] font-headline text-primary uppercase tracking-widest mt-1">
                {FORGE_PLANS[currentTier]?.name.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[9px] font-headline uppercase tracking-widest text-muted-foreground/50">Core Interfaces</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                const hasAccess = isTierGreaterOrEqual(currentTier, item.tierRequired);
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      isActive={activeView === item.id}
                      onClick={() => hasAccess && onNavigate(item.id)}
                      tooltip={item.title + (!hasAccess ? " (Locked)" : "")}
                      className={cn(
                        "hover:bg-sidebar-accent group transition-all duration-200",
                        activeView === item.id && "bg-sidebar-accent text-primary",
                        !hasAccess && "opacity-40 cursor-not-allowed grayscale"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", activeView === item.id && "text-primary")} />
                      <span className="text-[10px] font-headline uppercase tracking-tight flex items-center justify-between w-full">
                        {item.title}
                        {!hasAccess && <Lock className="h-2.5 w-2.5 ml-auto text-muted-foreground/50" />}
                        {item.enterpriseOnly && hasAccess && <Zap className="h-2.5 w-2.5 ml-auto text-primary" />}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="System Settings"
              onClick={() => onNavigate('settings')}
              isActive={activeView === 'settings'}
            >
              <Settings className={cn("h-4 w-4", activeView === 'settings' && "text-primary")} />
              <span className="text-[10px] font-headline uppercase">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {state !== "collapsed" && (
            <div className="mt-4 px-2 text-center opacity-30">
               <p className="text-[6px] font-headline uppercase tracking-[0.2em]">Forge OS © 2026</p>
               <p className="text-[5px] font-headline uppercase tracking-[0.1em] mt-1">VINEXSAH TECHNOLOGIES</p>
            </div>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
