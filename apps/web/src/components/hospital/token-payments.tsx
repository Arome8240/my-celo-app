"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HOSPITAL_TOKEN_ADDRESS, HOSPITAL_TOKEN_ABI } from "@/lib/contracts";
import { formatUnits, parseUnits, isAddress } from "viem";
import {
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Gift,
  DollarSign,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "payment" | "reward";
  patientName: string;
  patientMRN: string;
  amount: string;
  description: string;
  date: string;
  time: string;
  status: "completed" | "pending";
}

export function TokenPayments() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<"accept" | "reward">("accept");
  const [patientAddress, setPatientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Read hospital's token balance
  const { data: balance } = useReadContract({
    address: HOSPITAL_TOKEN_ADDRESS,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !!address },
  });

  const balanceFormatted = balance ? formatUnits(balance, 18) : "0";

  // Mock transaction history
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "payment",
      patientName: "John Doe",
      patientMRN: "MRN001247",
      amount: "50",
      description: "Consultation fee",
      date: "2024-04-22",
      time: "10:30 AM",
      status: "completed",
    },
    {
      id: "2",
      type: "reward",
      patientName: "Jane Smith",
      patientMRN: "MRN001248",
      amount: "10",
      description: "Completed health screening",
      date: "2024-04-22",
      time: "11:15 AM",
      status: "completed",
    },
    {
      id: "3",
      type: "payment",
      patientName: "Bob Johnson",
      patientMRN: "MRN001249",
      amount: "75",
      description: "Lab tests",
      date: "2024-04-22",
      time: "02:00 PM",
      status: "completed",
    },
  ]);

  const handleReward = async () => {
    if (!isAddress(patientAddress) || !amount) return;

    try {
      const amountInWei = parseUnits(amount, 18);
      // In production, this would transfer from hospital's balance
      // For now, we'll just log it
      console.log("Rewarding patient:", { patientAddress, amount, description });
      
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setPatientAddress("");
      setAmount("");
      setDescription("");
    } catch (err) {
      console.error("Reward error:", err);
    }
  };

  const isValidAddress = isAddress(patientAddress);
  const isValidAmount = amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;

  const todayStats = {
    paymentsReceived: transactions
      .filter((t) => t.type === "payment" && t.date === "2024-04-22")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    rewardsGiven: transactions
      .filter((t) => t.type === "reward" && t.date === "2024-04-22")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    transactionCount: transactions.filter((t) => t.date === "2024-04-22").length,
  };

  return (
    <div className="space-y-4">
      {/* Balance Card */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Hospital HNT Balance</p>
              <p className="text-3xl font-bold">{parseFloat(balanceFormatted).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Hospital Network Tokens</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Today's Payments</p>
                <p className="text-xl font-semibold text-primary">
                  +{todayStats.paymentsReceived.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Today's Rewards</p>
                <p className="text-xl font-semibold text-secondary">
                  -{todayStats.rewardsGiven.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <button
          onClick={() => setActiveTab("accept")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "accept"
              ? "bg-background shadow-sm"
              : "hover:bg-background/50"
          }`}
        >
          <DollarSign className="h-4 w-4" />
          Accept Payment
        </button>
        <button
          onClick={() => setActiveTab("reward")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "reward"
              ? "bg-background shadow-sm"
              : "hover:bg-background/50"
          }`}
        >
          <Gift className="h-4 w-4" />
          Reward Patient
        </button>
      </div>

      {/* Accept Payment Form */}
      {activeTab === "accept" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Accept Token Payment</CardTitle>
            <CardDescription>
              Receive HNT tokens from patients for services rendered
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Payment Instructions</h4>
              <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                <li>Patient initiates payment from their wallet</li>
                <li>Patient sends HNT to hospital address</li>
                <li>Transaction appears in history below</li>
                <li>Generate receipt for patient records</li>
              </ol>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Hospital Wallet Address</label>
              <div className="flex gap-2">
                <Input value={address || ""} readOnly className="font-mono text-sm" />
                <Button
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(address || "")}
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this address with patients for token payments
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Button variant="outline" className="w-full">
                <span className="mr-2">📱</span>
                Show QR Code
              </Button>
              <Button variant="outline" className="w-full">
                <span className="mr-2">📧</span>
                Email Address
              </Button>
              <Button variant="outline" className="w-full">
                <span className="mr-2">💬</span>
                SMS Address
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reward Patient Form */}
      {activeTab === "reward" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reward Patient with Tokens</CardTitle>
            <CardDescription>
              Send HNT tokens to patients as rewards for health achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient Wallet Address *</label>
              <Input
                placeholder="0x..."
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
                className="font-mono text-sm"
              />
              {patientAddress && !isValidAddress && (
                <p className="text-xs text-destructive">Invalid address format</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reward Amount (HNT) *</label>
              <Input
                type="number"
                placeholder="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Reward</label>
              <select
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select reason</option>
                <option value="health-screening">Completed Health Screening</option>
                <option value="preventive-care">Preventive Care Visit</option>
                <option value="medication-adherence">Medication Adherence</option>
                <option value="health-goal">Achieved Health Goal</option>
                <option value="appointment-completion">Completed Appointment</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Quick Reward Amounts */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Amounts</label>
              <div className="grid grid-cols-4 gap-2">
                {["5", "10", "25", "50"].map((val) => (
                  <Button
                    key={val}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(val)}
                    className="text-xs"
                  >
                    {val} HNT
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleReward}
              disabled={!isValidAddress || !isValidAmount || isPending || isConfirming}
              className="w-full"
              size="lg"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isPending ? "Confirming..." : "Sending..."}
                </>
              ) : (
                <>
                  <Gift className="mr-2 h-4 w-4" />
                  Send Reward
                </>
              )}
            </Button>

            {isSuccess && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm">Reward sent successfully!</span>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                <span className="text-sm">{error.message}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions</CardTitle>
          <CardDescription>{transactions.length} transactions today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
              >
                <div
                  className={`p-2 rounded-lg ${
                    tx.type === "payment" ? "bg-primary/10" : "bg-secondary/10"
                  }`}
                >
                  {tx.type === "payment" ? (
                    <ArrowDownLeft className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-secondary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate">{tx.patientName}</p>
                    <Badge variant="outline" className="text-xs">
                      {tx.patientMRN}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{tx.description}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      tx.type === "payment" ? "text-primary" : "text-secondary"
                    }`}
                  >
                    {tx.type === "payment" ? "+" : "-"}
                    {tx.amount} HNT
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
