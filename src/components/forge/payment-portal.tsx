"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  CheckCircle2, 
  Crown, 
  Factory, 
  Rocket, 
  BrainCircuit, 
  Smartphone,
  Loader2,
  Globe,
  Zap,
  Building2,
  ShieldCheck,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentRouter } from "@/lib/payment-router";
import { useForgeRuntime } from "@/context/forge-runtime-context";
import { useToast } from "@/hooks/use-toast";
import { FORGE_PLANS, SubscriptionTier } from "@/lib/billing-engine";

const personalPlans = [
  { id: 'pro', icon: Rocket, accent: "text-blue-500", desc: "For individual builders." },
  { id: 'premium', icon: BrainCircuit, accent: "text-primary", popular: true, desc: "Power users & automation." },
  { id: 'elite', icon: Crown, accent: "text-orange-500", desc: "Professional architects." },
];

const enterprisePlans = [
  { id: 'ent_pro', icon: Building2, accent: "text-blue-400", desc: "Collaborative engineering teams." },
  { id: 'ent_premium', icon: ShieldCheck, accent: "text-primary", desc: "High-concurrency swarms." },
  { id: 'ent_elite', icon: Zap, accent: "text-red-500", desc: "Autonomous digital civilization." },
];

export function PaymentPortal() {
  const { user, profile } = useForgeRuntime();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>('premium');
  const [region, setRegion] = useState('US');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.region) setRegion(profile.region);
  }, [profile]);

  const handleCheckout = async (planId: SubscriptionTier) => {
    if (!user) return;
    setIsProcessing(true);
    
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, plan: planId, region })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setCheckoutUrl(data.data.checkoutUrl);
        toast({
          title: "Settlement Tunnel Ready",
          description: `Routing via ${data.data.provider.toUpperCase()} regional gateway.`,
        });
      } else {
        throw new Error(data.error?.message || "Checkout initiation failed");
      }
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Settlement Interrupt",
        description: e.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPlanCard = (plan: any) => {
    const limits = FORGE_PLANS[plan.id as SubscriptionTier];
    const isCurrent = profile?.plan === plan.id;

    return (
      <Card 
        key={plan.id} 
        className={cn(
          "bg-card border-2 transition-all relative overflow-hidden flex flex-col cursor-pointer group h-full",
          plan.id === selectedPlan ? "border-primary shadow-[0_0_40px_rgba(255,107,0,0.15)] scale-[1.02] z-10" : "border-border/30 opacity-80 hover:opacity-100 hover:border-border"
        )}
        onClick={() => { setSelectedPlan(plan.id); setCheckoutUrl(null); }}
      >
        {plan.popular && (
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[7px] font-headline uppercase px-3 py-1 rounded-bl font-bold">
            Best Value
          </div>
        )}
        <CardHeader className="p-6">
          <plan.icon className={cn("h-8 w-8 mb-4 transition-colors", plan.id === selectedPlan ? plan.accent : "text-muted-foreground")} />
          <CardTitle className="text-xs font-headline uppercase tracking-widest">{limits.name}</CardTitle>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-headline font-bold">
              {PaymentRouter.formatLocalPrice(limits.priceMonthly, region)}
            </span>
            <span className="text-[8px] text-muted-foreground uppercase font-headline">/ MO</span>
          </div>
          <p className="text-[9px] text-muted-foreground uppercase font-headline mt-2">{plan.desc}</p>
        </CardHeader>
        <CardContent className="flex-1 px-6 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-[9px] font-headline uppercase text-primary font-bold">
            <Zap className="h-3 w-3" /> Quota: {limits.dailyAIQuota.toLocaleString()} AI/day
          </div>
          <div className="flex items-center gap-2 text-[9px] font-headline uppercase text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-green-500" /> {limits.priority.toUpperCase()} PRIORITY
          </div>
          <div className="flex items-center gap-2 text-[9px] font-headline uppercase text-muted-foreground">
             <CheckCircle2 className="h-3 w-3 text-primary" /> {limits.historyDays === -1 ? 'Unlimited' : `${limits.historyDays}-Day`} History
          </div>
          {limits.isAutonomousEnabled && (
            <div className="flex items-center gap-2 text-[9px] font-headline uppercase text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-primary" /> AUTONOMOUS AGENTS
            </div>
          )}
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button 
            onClick={() => handleCheckout(plan.id)}
            disabled={isProcessing || isCurrent}
            className={cn(
              "w-full text-[9px] font-headline uppercase h-9 rounded-xl transition-all",
              plan.id === selectedPlan ? "molten-glow font-bold" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {isProcessing && selectedPlan === plan.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isCurrent ? (
              "Current License"
            ) : (
              `Authorize License`
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-border pb-8">
        <div className="text-left space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Factory className="h-5 w-5 text-primary" />
            <h2 className="text-3xl font-headline font-bold uppercase tracking-tighter italic text-primary">License Settlement Hub</h2>
          </div>
          <p className="text-muted-foreground text-[10px] font-headline uppercase tracking-[0.3em]">Tier-Based Entitlement Enforcement • Regional Settlement Logic</p>
        </div>
        
        <Card className="bg-card border-border/50 p-2 flex items-center gap-4 shadow-xl">
          <Globe className="h-3 w-3 text-primary ml-3" />
          <select 
            value={region} 
            onChange={(e) => setRegion(e.target.value)}
            className="bg-transparent border-none text-[10px] font-headline uppercase focus:ring-0 cursor-pointer text-primary font-bold pr-8"
          >
            <option value="US">USD ($) - Int</option>
            <option value="GB">GBP (£) - UK</option>
            <option value="EU">EUR (€) - EU</option>
            <option value="NG">NGN (₦) - NG</option>
            <option value="ZA">ZAR (R) - ZA</option>
            <option value="UG">UGX (USh) - UG</option>
          </select>
        </Card>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-muted/30 border border-border/50 p-1 h-12 rounded-xl">
            <TabsTrigger value="personal" className="text-[10px] font-headline uppercase px-10 h-full">Personal Architect</TabsTrigger>
            <TabsTrigger value="enterprise" className="text-[10px] font-headline uppercase px-10 h-full">Enterprise Infrastructure</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="personal" className="animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {personalPlans.map(renderPlanCard)}
          </div>
        </TabsContent>

        <TabsContent value="enterprise" className="animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enterprisePlans.map(renderPlanCard)}
          </div>
          <div className="mt-12 p-8 rounded-3xl bg-blue-500/5 border border-blue-500/20 text-center space-y-4">
             <Building2 className="h-12 w-12 text-blue-500 mx-auto" />
             <h3 className="text-xl font-headline font-bold uppercase tracking-widest text-blue-400">Custom Sovereign Cloud</h3>
             <p className="text-[10px] text-muted-foreground uppercase font-headline max-w-lg mx-auto leading-relaxed">
                Dedicated infrastructure, air-gapped sync, and private model fine-tuning for regulated industries.
             </p>
             <Button variant="outline" className="h-10 px-8 text-[10px] font-headline uppercase border-blue-500/30 text-blue-400 hover:bg-blue-500/10 rounded-xl">
                Consult Regional Architect <ArrowUpRight className="h-3.5 w-3.5 ml-2" />
             </Button>
          </div>
        </TabsContent>
      </Tabs>

      {checkoutUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
           <Card className="w-full max-w-md bg-card border-primary/20 shadow-[0_0_50px_rgba(255,107,0,0.2)] rounded-3xl">
             <CardHeader className="text-center">
                <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-sm font-headline uppercase tracking-widest text-foreground">Secure Settlement Tunnel</CardTitle>
                <CardDescription className="text-[10px] font-headline uppercase">Identity Verification Pending via {region} Route</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6 pb-8">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-center space-y-2 group hover:border-primary/30 transition-all">
                      <Smartphone className="h-6 w-6 mx-auto text-primary" />
                      <p className="text-[8px] font-headline uppercase">Mobile Money</p>
                   </div>
                   <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-center space-y-2 group hover:border-primary/30 transition-all">
                      <CreditCard className="h-6 w-6 mx-auto text-primary" />
                      <p className="text-[8px] font-headline uppercase">Global Card</p>
                   </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 h-10 text-[9px] uppercase font-headline rounded-xl" onClick={() => setCheckoutUrl(null)}>Abort</Button>
                  <Button asChild className="flex-1 h-10 text-[9px] uppercase font-headline molten-glow rounded-xl">
                    <a href={checkoutUrl} target="_blank" rel="noreferrer">Initialize Payment</a>
                  </Button>
                </div>
             </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
}
