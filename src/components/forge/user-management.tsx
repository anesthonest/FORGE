
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  MoreVertical, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  UserMinus, 
  ShieldCheck,
  Mail,
  Calendar
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const mockUsers = [
  { id: "u1", email: "alex.d@mesh-prime.io", name: "Alex Dev", plan: "premium", role: "user", status: "active", createdAt: "2024-03-01" },
  { id: "u2", email: "sarah.v@google.com", name: "Sarah Volkov", plan: "pro", role: "user", status: "active", createdAt: "2024-03-12" },
  { id: "u3", email: "admin@forge-os.com", name: "System Admin", plan: "enterprise", role: "admin", status: "active", createdAt: "2024-01-01" },
  { id: "u4", email: "temp@trashmail.io", name: "Test User", plan: "free", role: "user", status: "suspended", createdAt: "2024-03-15" },
  { id: "u5", email: "ken.j@startup.ug", name: "Ken Jambo", plan: "pro", role: "user", status: "active", createdAt: "2024-03-14" },
];

export function UserManagement() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search registry by email, name or ID..." 
            className="pl-10 bg-card/50 border-border h-10 text-xs font-body"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-10 text-[10px] font-headline uppercase">Export CSV</Button>
      </div>

      <Card className="border-border bg-card/30">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[10px] font-headline uppercase">Subject</TableHead>
              <TableHead className="text-[10px] font-headline uppercase">Identity Tier</TableHead>
              <TableHead className="text-[10px] font-headline uppercase">Status</TableHead>
              <TableHead className="text-[10px] font-headline uppercase">Enrollment</TableHead>
              <TableHead className="text-right text-[10px] font-headline uppercase"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id} className="border-border hover:bg-white/5 transition-colors group">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-headline font-bold">{user.name}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Mail className="h-2.5 w-2.5" /> {user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "text-[8px] h-4 uppercase font-headline",
                    user.plan === 'premium' ? "border-primary/40 text-primary" : 
                    user.plan === 'enterprise' ? "border-red-500/40 text-red-500" : "border-border/60 text-muted-foreground"
                  )}>
                    {user.plan}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      user.status === 'active' ? "bg-green-500" : "bg-red-500"
                    )} />
                    <span className="text-[10px] font-headline uppercase">{user.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[10px] text-muted-foreground font-headline uppercase flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {user.createdAt}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border w-48">
                      <DropdownMenuItem className="text-[10px] font-headline uppercase gap-2">
                        <ArrowUpCircle className="h-3.5 w-3.5 text-primary" /> Upgrade to Premium
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[10px] font-headline uppercase gap-2">
                        <ArrowDownCircle className="h-3.5 w-3.5 text-blue-500" /> Downgrade to Free
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem className="text-[10px] font-headline uppercase gap-2 text-red-500">
                        <UserMinus className="h-3.5 w-3.5" /> Suspend Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
