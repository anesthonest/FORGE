"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Puzzle, 
  Search, 
  Settings2, 
  Download, 
  Trash2, 
  RefreshCcw, 
  ShieldCheck, 
  Zap,
  Activity,
  Cpu,
  Globe,
  Plus,
  Layers,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { pluginSystem, type ForgePlugin } from "@/ai/core/plugin-system";

/**
 * @fileOverview Plugin Manager UI (Modular Architecture v2)
 */

export function PluginManager() {
  const [plugins, setPlugins] = useState<ForgePlugin[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setPlugins(pluginSystem.getAllPlugins());
  }, []);

  const togglePlugin = (id: string) => {
    pluginSystem.togglePlugin(id);
    setPlugins([...pluginSystem.getAllPlugins()]);
  };

  const filteredPlugins = plugins.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Plugin Registry (Security, UI, AI, Data)..." 
            className="pl-10 bg-card border-border h-11 text-sm font-body"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-[10px] font-headline uppercase h-11 border-border/50">
            Export Manifest
          </Button>
          <Button className="font-headline text-[10px] uppercase h-11 px-6 molten-glow flex items-center gap-2 text-white">
            <Plus className="h-4 w-4" />
            Install from URL
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlugins.map((plugin) => (
          <Card key={plugin.plugin_id} className={cn(
            "bg-card/50 border-border transition-all group",
            plugin.status === 'active' ? "border-l-4 border-l-primary" : "opacity-60"
          )}>
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded bg-muted text-muted-foreground transition-colors",
                    plugin.status === 'active' && "text-primary bg-primary/10"
                  )}>
                    <Puzzle className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-headline font-bold uppercase tracking-tight">{plugin.name}</span>
                    <p className="text-[8px] text-muted-foreground font-headline uppercase">v{plugin.version} • {plugin.author}</p>
                  </div>
                </div>
                <Switch 
                  checked={plugin.status === 'active'} 
                  onCheckedChange={() => togglePlugin(plugin.plugin_id)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[7px] h-3.5 uppercase font-headline">{plugin.type}</Badge>
                {plugin.triggers.slice(0, 2).map(t => (
                  <Badge key={t} variant="outline" className="text-[7px] h-3.5 uppercase font-headline opacity-50">{t}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-[10px] text-muted-foreground leading-relaxed italic mb-4">
                "{plugin.description}"
              </p>
              
              <div className="space-y-2 mb-4">
                <h4 className="text-[8px] font-headline uppercase text-muted-foreground tracking-widest">Capabilities</h4>
                <div className="flex flex-wrap gap-1">
                  {plugin.capabilities.map(c => (
                    <span key={c} className="text-[8px] font-headline text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">{c}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border/30">
                <Button variant="ghost" className="h-7 text-[8px] font-headline uppercase flex-1">
                  <Settings2 className="h-3 w-3 mr-1" /> Config
                </Button>
                <Button variant="ghost" className="h-7 text-[8px] font-headline uppercase flex-1 text-red-500 hover:text-red-600 hover:bg-red-500/5">
                  <Trash2 className="h-3 w-3 mr-1" /> Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed border-2 border-border bg-card/20 p-8 text-center rounded-2xl">
        <div className="max-w-md mx-auto space-y-4">
           <Download className="h-8 w-8 text-muted-foreground/30 mx-auto" />
           <div>
             <h3 className="text-sm font-headline font-bold uppercase">Extend the Fabric</h3>
             <p className="text-[10px] text-muted-foreground uppercase font-headline leading-relaxed mt-1">
               Browse the official Forge Marketplace for thousands of community-built plugins for database optimization, infrastructure scaling, and advanced AI reasoning.
             </p>
           </div>
           <Button variant="outline" className="h-9 text-[10px] font-headline uppercase border-primary/20 text-primary hover:bg-primary/5 rounded-xl">
             Explore Marketplace
           </Button>
        </div>
      </Card>
    </div>
  );
}
