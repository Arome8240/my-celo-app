"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HOSPITAL_TOKEN_ADDRESS, HOSPITAL_TOKEN_ABI, ROLES } from "@/lib/contracts";
import { isAddress } from "viem";
import { Shield, UserPlus, UserMinus, Loader2, CheckCircle2, XCircle } from "lucide-react";

type RoleType = "admin" | "minter" | "pauser";

const ROLE_INFO = {
  admin: {
    label: "Admin",
    description: "Full control over all roles and operations",
    roleHash: ROLES.DEFAULT_ADMIN,
    color: "bg-red-500",
  },
  minter: {
    label: "Minter",
    description: "Can mint new tokens up to max supply",
    roleHash: ROLES.MINTER,
    color: "bg-blue-500",
  },
  pauser: {
    label: "Pauser",
    description: "Can pause/unpause token operations",
    roleHash: ROLES.PAUSER,
    color: "bg-yellow-500",
  },
};

export function RoleManagement() {
  const { address } = useAccount();
  const [selectedRole, setSelectedRole] = useState<RoleType>("minter");
  const [targetAddress, setTargetAddress] = useState("");
  const [checkAddress, setCheckAddress] = useState("");

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Check if current user is admin
  const { data: isAdmin } = useReadContract({
    address: HOSPITAL_TOKEN_ADDRESS,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: "hasRole",
    args: [ROLES.DEFAULT_ADMIN, address!],
    query: { enabled: !!address },
  });

  // Check role for target address
  const { data: hasRole, refetch: refetchRole } = useReadContract({
    address: HOSPITAL_TOKEN_ADDRESS,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: "hasRole",
    args: [ROLE_INFO[selectedRole].roleHash, checkAddress as `0x${string}`],
    query: { enabled: isAddress(checkAddress) },
  });

  const handleGrantRole = async () => {
    if (!isAddress(targetAddress)) return;

    writeContract({
      address: HOSPITAL_TOKEN_ADDRESS,
      abi: HOSPITAL_TOKEN_ABI,
      functionName: "grantRole",
      args: [ROLE_INFO[selectedRole].roleHash, targetAddress as `0x${string}`],
    });
  };

  const handleRevokeRole = async () => {
    if (!isAddress(targetAddress)) return;

    writeContract({
      address: HOSPITAL_TOKEN_ADDRESS,
      abi: HOSPITAL_TOKEN_ABI,
      functionName: "revokeRole",
      args: [ROLE_INFO[selectedRole].roleHash, targetAddress as `0x${string}`],
    });
  };

  const isValidAddress = isAddress(targetAddress);
  const isCheckValid = isAddress(checkAddress);

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Admin Access Required</h3>
            <p className="text-sm text-muted-foreground">
              You need DEFAULT_ADMIN_ROLE to manage roles
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Role Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Role</CardTitle>
          <CardDescription>Choose which role to grant or revoke</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {(Object.keys(ROLE_INFO) as RoleType[]).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedRole === role
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-3 w-3 rounded-full ${ROLE_INFO[role].color}`} />
                  <span className="font-semibold text-sm">{ROLE_INFO[role].label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{ROLE_INFO[role].description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grant/Revoke Role */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manage {ROLE_INFO[selectedRole].label} Role</CardTitle>
          <CardDescription>Grant or revoke role for an address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Address</label>
            <Input
              placeholder="0x..."
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              className="font-mono text-sm"
            />
            {targetAddress && !isValidAddress && (
              <p className="text-xs text-destructive">Invalid address format</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleGrantRole}
              disabled={!isValidAddress || isPending || isConfirming}
              className="flex-1"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isPending ? "Confirming..." : "Processing..."}
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Grant Role
                </>
              )}
            </Button>
            <Button
              onClick={handleRevokeRole}
              disabled={!isValidAddress || isPending || isConfirming}
              variant="destructive"
              className="flex-1"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isPending ? "Confirming..." : "Processing..."}
                </>
              ) : (
                <>
                  <UserMinus className="mr-2 h-4 w-4" />
                  Revoke Role
                </>
              )}
            </Button>
          </div>

          {isSuccess && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm">Transaction successful!</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm">{error.message}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Check Role */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Check Role Status</CardTitle>
          <CardDescription>Verify if an address has the selected role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Address to Check</label>
            <Input
              placeholder="0x..."
              value={checkAddress}
              onChange={(e) => setCheckAddress(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {isCheckValid && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Has {ROLE_INFO[selectedRole].label} Role:
                </span>
                <Badge variant={hasRole ? "default" : "outline"}>
                  {hasRole ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          )}

          <Button
            onClick={() => refetchRole()}
            variant="outline"
            size="sm"
            disabled={!isCheckValid}
            className="w-full sm:w-auto"
          >
            Refresh Status
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
