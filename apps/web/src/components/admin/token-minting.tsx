"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HOSPITAL_TOKEN_ADDRESS, HOSPITAL_TOKEN_ABI, ROLES } from "@/lib/contracts";
import { isAddress, parseUnits, formatUnits } from "viem";
import { Coins, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export function TokenMinting() {
  const { address } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Check if user has minter role
  const { data: isMinter } = useReadContract({
    address: HOSPITAL_TOKEN_ADDRESS,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: "hasRole",
    args: [ROLES.MINTER, address!],
    query: { enabled: !!address },
  });

  // Get supply info
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

  const handleMint = async () => {
    if (!isAddress(recipient) || !amount) return;

    try {
      const amountInWei = parseUnits(amount, 18);
      writeContract({
        address: HOSPITAL_TOKEN_ADDRESS,
        abi: HOSPITAL_TOKEN_ABI,
        functionName: "mint",
        args: [recipient as `0x${string}`, amountInWei],
      });
    } catch (err) {
      console.error("Mint error:", err);
    }
  };

  const isValidAddress = isAddress(recipient);
  const isValidAmount = amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;
  
  const remaining = cap && totalSupply ? formatUnits(cap - totalSupply, 18) : "0";
  const remainingNum = parseFloat(remaining);
  const amountNum = parseFloat(amount || "0");
  const wouldExceedCap = amountNum > remainingNum;

  if (!isMinter) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Minter Access Required</h3>
            <p className="text-sm text-muted-foreground">
              You need MINTER_ROLE to mint new tokens
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Supply Info */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Supply</p>
              <p className="text-2xl font-bold">
                {totalSupply ? parseFloat(formatUnits(totalSupply, 18)).toLocaleString() : "0"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Max Supply</p>
              <p className="text-2xl font-bold">
                {cap ? parseFloat(formatUnits(cap, 18)).toLocaleString() : "0"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Remaining</p>
              <p className="text-2xl font-bold text-primary">
                {parseFloat(remaining).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mint Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mint New Tokens</CardTitle>
          <CardDescription>Create new HNT tokens and send to a recipient</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient Address</label>
            <Input
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="font-mono text-sm"
            />
            {recipient && !isValidAddress && (
              <p className="text-xs text-destructive">Invalid address format</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (HNT)</label>
            <Input
              type="number"
              placeholder="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
            {amount && !isValidAmount && (
              <p className="text-xs text-destructive">Invalid amount</p>
            )}
            {isValidAmount && wouldExceedCap && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-medium text-destructive">Exceeds remaining supply</p>
                  <p className="text-muted-foreground mt-1">
                    Only {parseFloat(remaining).toLocaleString()} HNT available to mint
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Amounts</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["100", "1000", "10000", "100000"].map((val) => (
                <Button
                  key={val}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(val)}
                  className="text-xs"
                >
                  {parseFloat(val).toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleMint}
            disabled={!isValidAddress || !isValidAmount || wouldExceedCap || isPending || isConfirming}
            className="w-full"
            size="lg"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isPending ? "Confirming..." : "Minting..."}
              </>
            ) : (
              <>
                <Coins className="mr-2 h-4 w-4" />
                Mint {amount || "0"} HNT
              </>
            )}
          </Button>

          {isSuccess && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Tokens minted successfully!</p>
                <p className="text-muted-foreground text-xs mt-1">
                  {amount} HNT sent to {recipient.slice(0, 6)}...{recipient.slice(-4)}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Transaction failed</p>
                <p className="text-muted-foreground text-xs mt-1">{error.message}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Minting Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Minting Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Verify recipient address before minting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Cannot exceed max supply cap of 10,000,000 HNT</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Minting is irreversible - tokens can only be burned by holders</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>All minting operations are recorded on-chain</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
