"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Search, 
  Star, 
  Download, 
  Zap,
  Layers,
  DollarSign,
  Plus,
  Sparkles,
  Coins,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Forge AI App Marketplace (Hydrated v2)
 * Wired to /api/marketplace for real-time asset discovery.
 */

export function MarketplacePortal() {
  const [query, setQuery] = useState("");
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch('/api/marketplace');
        const json = await res.json();
        if (json.success) setAssets(json.data);
      } catch (e) {
        console.error("Marketplace fetch fault.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(query.toLowerCase()) || 
    a.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Sovereign Systems, Agents & Workflows..." 
            className="pl-10 bg-card border-border h-11 text-sm font-body focus:ring-primary w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-[10px] font-headline uppercase h-11 border-border/50">
            Developer Console
          </Button>
          <Button className="font-headline text-[10px] uppercase h-11 px-6 molten-glow flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Publish System
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="h-[200px] border-border bg-card/20 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAssets.map((asset) => (
                <Card key={asset.id} className="bg-card/50 border-border hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden">
                  <CardHeader className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {asset.type === 'System' ? <Layers className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                        </div>
                        <span className="text-sm font-headline font-bold uppercase tracking-tight group-hover:text-primary transition-colors">{asset.name}</span>
                      </div>
                      <Badge variant="outline" className="text-[8px] h-4 font-headline uppercase border-green-500/20 text-green-500">{asset.status}</Badge>
                    </div>
                    <CardDescription className="text-[10px] font-headline uppercase text-muted-foreground line-clamp-1">
                      {asset.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-5 pb-5">
                    <div className="flex items-center justify-between text-[9px] font-headline uppercase text-muted-foreground mb-6">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1"><Download className="h-2.5 w-2.5" /> {asset.installs}</span>
                        <span className="flex items-center gap-1 text-primary"><DollarSign className="h-2.5 w-2.5" /> {asset.revenue}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                        <span className="text-primary font-bold">{asset.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-headline font-bold">${asset.price}</span>
                        <span className="text-[7px] text-muted-foreground uppercase font-headline">One-Time Fee</span>
                      </div>
                      <Button className="h-8 text-[9px] font-headline uppercase molten-glow px-6">Fork to Mesh</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20 shadow-2xl">
            <CardHeader className="p-4 border-b border-primary/10">
              <CardTitle className="text-xs font-headline uppercase tracking-widest flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                Value Principal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <p className="text-[9px] text-muted-foreground uppercase leading-relaxed font-headline italic">
                Forge OS monetizes speed and automation. You earn 70% of every fork. Viral attribution ensures you get credited even when your code is used as a sub-module.
              </p>
              <div className="p-3 rounded bg-black/40 border border-primary/20">
                 <div className="flex justify-between items-center text-[10px] font-headline uppercase font-bold mb-1">
                    <span>Creator Trust Score</span>
                    <span className="text-primary">98.4%</span>
                 </div>
                 <Progress value={98.4} className="h-1 bg-muted" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardHeader className="p-4 border-b border-border/50">
              <CardTitle className="text-xs font-headline uppercase tracking-widest flex items-center gap-2 text-primary">
                <Coins className="h-4 w-4 text-primary" />
                Economy Intel
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
               <div className="space-y-2">
                 <div className="flex justify-between items-center text-[9px] font-headline uppercase">
                    <span className="text-muted-foreground">Platform Liquidity</span>
                    <span className="text-foreground font-bold">$1.4M</span>
                 </div>
                 <div className="flex justify-between items-center text-[9px] font-headline uppercase">
                    <span className="text-muted-foreground">Active Creators</span>
                    <span className="text-foreground font-bold">1,242</span>
                 </div>
               </div>
               <Button variant="outline" className="w-full h-9 text-[10px] font-headline uppercase border-primary/20 text-primary hover:bg-primary/5">
                  Become a Creator
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
