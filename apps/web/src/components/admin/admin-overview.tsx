"use client";

import { useAccount, useReadContract } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HOSPITAL_TOKEN_ADDRESS, HOSPITAL_TOKEN_ABI, ROLES } from "@/lib/contracts";
import { formatUnits } from "viem";
import { Activity, Coins, Lock, ShieldCheck } from "lucide-react";

export function AdminOverview() {
  const { address } = useAccount();

  // Read contract data
  const { data: totalSupply } = useReadContract({
    address: HOSPITAL_TOKEN_ADDRESS,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: "totalSupply",
  });

  const { data: cap } = useReadContract({
    address: HOSPITAL_TOKEN_ADDRESS,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: "cap",
  });

  const { data: isPaused } = useReadContract({
    address: HOSPITAL_TOKEN_ADDRESS,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: "paused",
  });

  const { data: isAdmin } = useReadContract({
    address: HOSPITAL_TOKEN_ADDRESS,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: "hasRole",
    args: [ROLES.DEFAULT_ADMIN, address!],
    query: { enabled: !!address },
  });

  const { data: isMinter } = useReadContract({
    address: HOSPITAL_TOKEN_ADDRESS,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: "hasRole",
    args: [ROLES.MINTER, address!],
    query: { enabled: !!address },
  });

  const { data: isPauser } = useReadContract({
    address: HOSPITAL_TOKEN_ADDRESS,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: "hasRole",
    args: [ROLES.PAUSER, address!],
    query: { enabled: !!address },
  });

  const supplyFormatted = totalSupply ? formatUnits(totalSupply, 18) : "0";
  const capFormatted = cap ? formatUnits(cap, 18) : "0";
  const remaining = cap && totalSupply ? formatUnits(cap - totalSupply, 18) : "0";
  const supplyPercentage = cap && totalSupply ? (Number(totalSupply) / Number(cap)) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Status Banner */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Contract Status</h3>
              <p className="text-sm text-muted-foreground">
                {isPaused ? "Operations are currently paused" : "All systems operational"}
              </p>
            </div>
            <Badge variant={isPaused ? "destructive" : "default"} className="w-fit">
              {isPaused ? "PAUSED" : "ACTIVE"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Your Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-5 w-5" />
            Your Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {isAdmin && <Badge variant="default">Admin</Badge>}
            {isMinter && <Badge variant="secondary">Minter</Badge>}
            {isPauser && <Badge variant="secondary">Pauser</Badge>}
            {!isAdmin && !isMinter && !isPauser && (
              <p className="text-sm text-muted-foreground">No admin roles assigned</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Supply Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parseFloat(supplyFormatted).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">HNT tokens minted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Supply</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parseFloat(capFormatted).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Hard cap limit</p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parseFloat(remaining).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Available to mint</p>
          </CardContent>
        </Card>
      </div>

      {/* Supply Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supply Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{supplyPercentage.toFixed(2)}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min(supplyPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{parseFloat(supplyFormatted).toLocaleString()} HNT</span>
              <span>{parseFloat(capFormatted).toLocaleString()} HNT</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
