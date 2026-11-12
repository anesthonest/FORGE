"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { getClientFirebase } from "@/lib/firebase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useWalletStore } from "@/stores/wallet-store";
import { BootstrapStage } from "@/lib/bootstrap/bootstrap-engine";

/**
 * @fileOverview Forge OS Stabilized Runtime (High-Performance v182)
 * Refactored for non-blocking hydration to eliminate UI freezes.
 */

interface ForgeRuntimeState {
  user: User | null;
  profile: any | null;
  authReady: boolean;
  meshState: 'syncing' | 'ready' | 'offline' | 'error';
  bootStage: BootstrapStage;
  readiness: {
    authReady: boolean;
    firestoreReady: boolean;
    meshReady: boolean;
    runtimeStable: boolean;
    hydrationComplete: boolean;
  };
  meshReady: boolean;
  profileReady: boolean;
  renderCount: number;
  addTrace: (msg: any) => void;
  activeView: string;
  navigate: (view: string) => void;
  performance: {
    bootTime: number;
    syncLatency: number;
  };
}

const ForgeRuntimeContext = createContext<ForgeRuntimeState | undefined>(undefined);

function SearchParamsHandler({ onActiveView }: { onActiveView: (view: string) => void }) {
  const searchParams = useSearchParams();
  const view = searchParams ? (searchParams.get("view") || "dashboard") : "dashboard";
  useEffect(() => {
    onActiveView(view);
  }, [view, onActiveView]);
  return null;
}

export function ForgeRuntimeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [activeView, setActiveView] = useState("dashboard");
  const { setUser, setProfile } = useAuthStore();
  const { updateWallet } = useWalletStore();

  const [bootStage, setBootStage] = useState<BootstrapStage>('UI_SHELL');
  const [meshState, setMeshState] = useState<'syncing' | 'ready' | 'offline' | 'error'>('syncing');
  const [user, setLocalUser] = useState<User | null>(null);
  const [profile, setLocalProfile] = useState<any | null>(null);
  const [performance, setPerformance] = useState({ bootTime: 0, syncLatency: 0 });
  const [renderCount] = useState(1);

  const addTrace = useCallback((msg: string) => {
    console.info(`[FORGE-TRACE]`, msg);
  }, []);

  const startTime = useRef(Date.now());
  const meshUnsub = useRef<Unsubscribe | null>(null);

  // 1. ASYNC IDENTITY RESOLUTION
  useEffect(() => {
    const { auth } = getClientFirebase();
    if (!auth) return;

    setBootStage('AUTH_RESOLVE');
    const unsub = onAuthStateChanged(auth, (u) => {
      setLocalUser(u);
      setUser(u);
      
      // Calculate boot time once auth is determined
      setPerformance(p => ({ ...p, bootTime: Date.now() - startTime.current }));
      
      if (!u) {
        setBootStage('STABLE');
        setMeshState('ready');
      } else {
        setBootStage('SESSION_LOAD');
      }
    });

    return () => unsub();
  }, [setUser]);

  // 2. NON-BLOCKING DATA HYDRATION
  useEffect(() => {
    if (bootStage !== 'SESSION_LOAD' || !user) return;
    
    const { db } = getClientFirebase();
    if (!db) return;

    setBootStage('FIRESTORE_INIT');
    const syncStart = Date.now();

    // Trigger non-blocking shell stabilization
    const stabilizeTimer = setTimeout(() => {
      setBootStage('STABLE');
    }, 800);

    meshUnsub.current = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setLocalProfile(data);
        setProfile(data);
        updateWallet(data.wallet || {});
        
        if (meshState === 'syncing') {
          setPerformance(p => ({ ...p, syncLatency: Date.now() - syncStart }));
          setMeshState('ready');
          setBootStage('STABLE');
        }
      }
    }, (err) => {
      console.error("[FORGE-MESH-SYNC] Background sync deferred:", err.message, err);
      setMeshState('ready'); // Fail soft to ready to allow UI interaction
      setBootStage('STABLE');
    });

    return () => {
      clearTimeout(stabilizeTimer);
      if (meshUnsub.current) meshUnsub.current();
    };
  }, [user, bootStage, setProfile, updateWallet, meshState]);

  const navigate = useCallback((view: string) => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set("view", view);
      router.replace(url.pathname + url.search);
    }
  }, [router]);

  const readiness = useMemo(() => ({
    authReady: !!user || bootStage === 'STABLE',
    firestoreReady: meshState === 'ready',
    meshReady: meshState === 'ready',
    runtimeStable: bootStage === 'STABLE',
    hydrationComplete: bootStage === 'STABLE'
  }), [user, meshState, bootStage]);

  const value = useMemo(() => ({
    user,
    profile,
    authReady: readiness.authReady,
    meshState,
    bootStage,
    readiness,
    meshReady: readiness.meshReady,
    profileReady: !!profile,
    renderCount,
    addTrace,
    activeView,
    navigate,
    performance
  }), [user, profile, meshState, bootStage, readiness, renderCount, addTrace, activeView, navigate, performance]);

  return (
    <ForgeRuntimeContext.Provider value={value}>
      <React.Suspense fallback={null}>
        <SearchParamsHandler onActiveView={setActiveView} />
      </React.Suspense>
      {children}
    </ForgeRuntimeContext.Provider>
  );
}

export const useForgeRuntime = () => {
  const context = useContext(ForgeRuntimeContext);
  if (!context) throw new Error("useForgeRuntime must be used within ForgeRuntimeProvider");
  return context;
};