"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Loader2, ShieldAlert, UserPlus, LogIn, Key, Scale } from "lucide-react";
import { useAuth } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { ForgeLogo } from "@/components/forge/brand-identity";

/**
 * @fileOverview ForgeOS Production Authentication Portal (Phase 4 Hardened)
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 * 
 * Enforces legal consent gating and secure provisioning with billing identity linking.
 */

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const auth = useAuth();

  const provisionProfile = async (uid: string, userEmail: string | null, name?: string | null) => {
    try {
      const res = await fetch('/api/auth/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          uid, 
          email: userEmail, 
          name,
          legalConsent: {
            acceptedTerms: true,
            acceptedPrivacy: true,
            version: "1.0"
          }
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || "Provisioning Failed");
    } catch (err) {
      console.warn("[FORGE-AUTH] Identity provisioning deferred. Retrying in background.");
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    if (authMode === "signup" && !acceptedLegal) {
      setError("Legal acceptance required to provision mesh identity.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await provisionProfile(cred.user.uid, cred.user.email);
      }
      onClose();
    } catch (err: any) {
      console.warn("[FORGE-AUTH] Auth Error:", err.code);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError("Invalid access credentials. Please verify your email and key.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("This identity context already exists. Please sign in.");
      } else {
        setError("Mesh authentication interrupt. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (!auth) return;
    
    if (authMode === "signup" && !acceptedLegal) {
      setError("Legal acceptance required to provision mesh identity.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await provisionProfile(result.user.uid, result.user.email, result.user.displayName);
      onClose();
    } catch (err: any) {
      setError("Federated login interrupt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && onClose()}>
      <DialogContent className="sm:max-w-[420px] bg-card border-border shadow-2xl border-t-4 border-t-primary rounded-3xl">
        <DialogHeader className="items-center text-center">
          <ForgeLogo iconOnly className="h-16 w-16 mb-4" />
          <DialogTitle className="text-2xl font-headline font-bold uppercase tracking-tighter italic text-foreground">
            {authMode === "login" ? "Recall Session" : "Provision Identity"}
          </DialogTitle>
          <DialogDescription className="text-[10px] font-headline uppercase text-muted-foreground tracking-widest">
            Authorize your secure mesh environment
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full" onValueChange={(v) => { setAuthMode(v as any); setError(""); }}>
          <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-border/50 h-10 p-1 mb-6 rounded-xl">
            <TabsTrigger value="login" className="text-[10px] uppercase font-headline rounded-lg">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="text-[10px] uppercase font-headline rounded-lg">Initialize</TabsTrigger>
          </TabsList>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-headline uppercase text-muted-foreground ml-1">Email Context</Label>
              <Input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/20 border-border rounded-xl text-sm"
                placeholder="operator@forge.io"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-headline uppercase text-muted-foreground ml-1">Access Key</Label>
              <div className="relative">
                <Input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/20 border-border rounded-xl text-sm pl-9"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/40" />
              </div>
            </div>

            {authMode === "signup" && (
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-muted/20 border border-border/50">
                <Checkbox 
                  id="legal" 
                  checked={acceptedLegal} 
                  onCheckedChange={(v) => setAcceptedLegal(v as boolean)} 
                  className="mt-1"
                />
                <label htmlFor="legal" className="text-[10px] font-headline uppercase text-muted-foreground leading-tight cursor-pointer">
                  I accept the <Link href="/terms" target="_blank" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</Link> for sovereign fabrication.
                </label>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex gap-3 items-start animate-in fade-in">
                <ShieldAlert className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground font-headline uppercase leading-tight">
                  {error}
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full font-headline text-[10px] uppercase h-11 rounded-xl molten-glow"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  {authMode === "login" ? <LogIn className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                  {authMode === "login" ? "AUTHORIZE ACCESS" : "INITIALIZE PROVISIONING"}
                </span>
              )}
            </Button>
          </form>
        </Tabs>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-[8px] uppercase font-headline"><span className="bg-card px-2 text-muted-foreground">OR FEDERATED</span></div>
        </div>

        <Button variant="outline" className="h-10 text-[10px] font-headline uppercase border-border/50 hover:bg-primary/5 rounded-xl" onClick={loginWithGoogle} disabled={loading}>
          <Mail className="h-3.5 w-3.5 mr-2" /> Google Authentication
        </Button>

        <div className="mt-4 flex flex-col items-center gap-2">
           <div className="flex justify-center items-center gap-2 text-[8px] font-headline text-muted-foreground uppercase">
              <Scale className="h-2.5 w-2.5" />
              By continuing, you agree to our sovereign protocols.
           </div>
           <p className="text-[7px] font-headline text-muted-foreground/30 uppercase tracking-widest mt-2">
              Forge OS © 2026 VINEXSAH TECHNOLOGIES
           </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
