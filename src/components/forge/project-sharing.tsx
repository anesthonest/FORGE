"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Users, 
  Lock,
  Globe,
  PlusCircle,
  Hammer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ProjectSharing({ projectId }: { projectId: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://forge.os/projects/${projectId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary flex items-center gap-2">
          <Share2 className="h-3 w-3" />
          Mesh Distribution
        </h4>
        <Badge variant="outline" className="text-[8px] font-headline uppercase border-green-500/20 text-green-500">Public Access</Badge>
      </div>
      
      <div className="flex gap-2">
        <Input 
          value={shareUrl} 
          readOnly 
          className="bg-black/20 border-border text-[10px] font-headline h-9 text-muted-foreground"
        />
        <Button 
          variant="outline" 
          size="icon" 
          className="h-9 w-9 shrink-0 border-border/50"
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
          <Hammer className="h-10 w-10 text-primary" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] font-headline font-bold uppercase text-primary">Viral Build Attribution</span>
        </div>
        <p className="text-[8px] text-muted-foreground uppercase font-headline leading-tight italic">
          This project is marked as <span className="text-foreground font-bold">"BUILT WITH FORGE"</span>. 
          Anyone with this link can fork this architecture as a starting template.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="h-8 text-[9px] font-headline uppercase border-border/50">
          <Users className="h-3 w-3 mr-2" /> Team Invites
        </Button>
        <Button variant="outline" className="h-8 text-[9px] font-headline uppercase border-border/50">
          <PlusCircle className="h-3 w-3 mr-2" /> Make Template
        </Button>
      </div>
    </div>
  );
}
