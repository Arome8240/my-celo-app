"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HOSPITAL_TOKEN_ADDRESS, HOSPITAL_TOKEN_ABI, ROLES } from "@/lib/contracts";
import { AlertTriangle, Loader2, CheckCircle2, XCircle, ShieldAlert, Play } from "lucide-react";

export function EmergencyControls() {
  const { address } = useAccount();
  const [showConfirm, setShowConfirm] = useState<"pause" | "unpause" | null>(null);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Check if user has pauser role
  const { data: isPauser } = useReadContract({
    address: HOSPITAL_TOKEN_ADDRESS,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: "hasRole",
    args: [ROLES.PAUSER, address!],
    query: { enabled: !!address },
  });

  // Check pause status
  const { data: isPaused, refetch: refetchPauseStatus } = useReadContract({
    address: HOSPITAL_TOKEN_ADDRESS,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: "paused",
  });

  const handlePause = async () => {
    writeContract({
      address: HOSPITAL_TOKEN_ADDRESS,
      abi: HOSPITAL_TOKEN_ABI,
      functionName: "pause",
    });
    setShowConfirm(null);
  };

  const handleUnpause = async () => {
    writeContract({
      address: HOSPITAL_TOKEN_ADDRESS,
      abi: HOSPITAL_TOKEN_ABI,
      functionName: "unpause",
    });
    setShowConfirm(null);
  };

  if (!isPauser) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Pauser Access Required</h3>
            <p className="text-sm text-muted-foreground">
              You need PAUSER_ROLE to control emergency functions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Status */}
      <Card className={`border-l-4 ${isPaused ? "border-l-destructive" : "border-l-primary"}`}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Contract Status</h3>
              <p className="text-sm text-muted-foreground">
                {isPaused
                  ? "All token operations are currently paused"
                  : "Contract is operating normally"}
              </p>
            </div>
            <Badge variant={isPaused ? "destructive" : "default"} className="w-fit text-sm px-4 py-2">
              {isPaused ? "PAUSED" : "ACTIVE"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Pause Control */}
      {!isPaused && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Pause Token Operations
            </CardTitle>
            <CardDescription>
              Emergency function to halt all token transfers, mints, and burns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h4 className="font-semibold text-sm mb-2 text-destructive">Warning: Critical Action</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>All token transfers will be blocked</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>Minting operations will be disabled</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>Token burning will be prevented</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>Only use in emergency situations</span>
                </li>
              </ul>
            </div>

            {!showConfirm || showConfirm !== "pause" ? (
              <Button
                onClick={() => setShowConfirm("pause")}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Pause Contract
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-center">Are you sure you want to pause?</p>
                <div className="flex gap-2">
                  <Button
                    onClick={handlePause}
                    disabled={isPending || isConfirming}
                    variant="destructive"
                    className="flex-1"
                  >
                    {isPending || isConfirming ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isPending ? "Confirming..." : "Pausing..."}
                      </>
                    ) : (
                      "Confirm Pause"
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowConfirm(null)}
                    variant="outline"
                    className="flex-1"
                    disabled={isPending || isConfirming}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Unpause Control */}
      {isPaused && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Resume Token Operations
            </CardTitle>
            <CardDescription>
              Restore normal contract functionality and enable all operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Unpausing will enable:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Token transfers between addresses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Minting new tokens (for authorized minters)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Token burning by holders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>All normal contract operations</span>
                </li>
              </ul>
            </div>

            {!showConfirm || showConfirm !== "unpause" ? (
              <Button
                onClick={() => setShowConfirm("unpause")}
                className="w-full"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                Unpause Contract
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-center">Confirm resuming operations?</p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUnpause}
                    disabled={isPending || isConfirming}
                    className="flex-1"
                  >
                    {isPending || isConfirming ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isPending ? "Confirming..." : "Unpausing..."}
                      </>
                    ) : (
                      "Confirm Unpause"
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowConfirm(null)}
                    variant="outline"
                    className="flex-1"
                    disabled={isPending || isConfirming}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Transaction Status */}
      {isSuccess && (
        <div className="flex items-center gap-2 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium">Operation successful!</p>
            <p className="text-muted-foreground text-xs mt-1">
              Contract is now {isPaused ? "paused" : "active"}
            </p>
          </div>
          <Button
            onClick={() => refetchPauseStatus()}
            variant="outline"
            size="sm"
            className="ml-auto"
          >
            Refresh
          </Button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-destructive">Transaction failed</p>
            <p className="text-muted-foreground text-xs mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {/* Usage Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Emergency Procedures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold mb-1">When to Pause:</h4>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Security vulnerability detected</li>
                <li>• Suspicious or malicious activity</li>
                <li>• Critical bug discovered</li>
                <li>• Regulatory compliance requirement</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Before Unpausing:</h4>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Verify issue is fully resolved</li>
                <li>• Communicate with stakeholders</li>
                <li>• Document incident and response</li>
                <li>• Ensure all systems are ready</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
