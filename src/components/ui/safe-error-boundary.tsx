"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, RefreshCcw, LayoutPanelLeft } from "lucide-react";

/**
 * @fileOverview ForgeOS High-Integrity Recovery Boundary
 * Detects ChunkLoadErrors and triggers deterministic runtime reloads.
 */

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorType: "chunk" | "runtime" | null;
}

export class SafeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorType: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    const isChunkError = 
      error.name === "ChunkLoadError" || 
      error.message.includes("Loading chunk") ||
      error.message.includes("Failed to fetch");

    return { 
      hasError: true, 
      errorType: isChunkError ? "chunk" : "runtime" 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[FORGE-RECOVERY] Runtime Fault Detected:", error, errorInfo);
    
    // Auto-recovery for chunk errors (automatic refresh once)
    if (this.state.errorType === "chunk") {
      const storageKey = "forge_chunk_retry";
      const lastRetry = localStorage.getItem(storageKey);
      const now = Date.now();

      if (!lastRetry || (now - parseInt(lastRetry)) > 10000) {
        localStorage.setItem(storageKey, now.toString());
        console.warn("[FORGE-RECOVERY] Corrupted chunk detected. Attempting deterministic resync...");
        window.location.reload();
      }
    }
  }

  private handleManualRetry = () => {
    this.setState({ hasError: false, errorType: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="p-8 w-full flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md w-full border-primary/20 bg-card/50 backdrop-blur-xl p-8 text-center space-y-6 rounded-3xl border-t-4 border-t-primary shadow-2xl">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
              {this.state.errorType === 'chunk' ? <LayoutPanelLeft className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-headline font-bold uppercase tracking-tighter italic">
                {this.state.errorType === 'chunk' ? "Module Graph Corrupted" : "Mesh Runtime Interrupted"}
              </h2>
              <p className="text-[10px] text-muted-foreground uppercase font-headline leading-relaxed">
                Forge encountered a partial loading failure in the engineering fabric.
                {this.state.errorType === 'chunk' ? " A resynchronization is required." : " The local orchestration node has crashed."}
              </p>
            </div>

            <Button 
              onClick={this.handleManualRetry}
              className="w-full h-11 uppercase font-headline text-[10px] rounded-xl molten-glow flex items-center justify-center gap-2"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Re-initialize Mesh
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
