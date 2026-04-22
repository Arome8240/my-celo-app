"use client";

import { useAccount, useReadContract } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HOSPITAL_TOKEN_ADDRESS, HOSPITAL_TOKEN_ABI } from "@/lib/contracts";
import { formatUnits } from "viem";
import {
  Users,
  Calendar,
  Coins,
  ArrowRightLeft,
  UserCheck,
  Bed,
  TrendingUp,
  Clock,
} from "lucide-react";

export function HospitalDashboard() {
  const { address } = useAccount();

  // Read hospital's token balance
  const { data: balance } = useReadContract({
    address: HOSPITAL_TOKEN_ADDRESS,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: !!address },
  });

  const balanceFormatted = balance ? formatUnits(balance, 18) : "0";

  // Mock data - in production, these would come from your backend/database
  const metrics = {
    totalPatients: 1247,
    appointmentsToday: 23,
    pendingReferrals: 5,
    staffOnDuty: 42,
    bedOccupancy: 78,
    avgWaitTime: 15,
  };

  const recentActivity = [
    { type: "appointment", patient: "John Doe", time: "10:30 AM", status: "completed" },
    { type: "payment", patient: "Jane Smith", amount: "50 HNT", time: "11:15 AM" },
    { type: "referral", patient: "Bob Johnson", hospital: "City General", time: "12:00 PM" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
        <p className="text-muted-foreground">Here's what's happening at your hospital today</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPatients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-primary">+12</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.appointmentsToday}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-primary">8 completed</span>, 15 pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">HNT Balance</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parseFloat(balanceFormatted).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Hospital Network Tokens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Referrals</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingReferrals}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff On Duty</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.staffOnDuty}</div>
            <p className="text-xs text-muted-foreground mt-1">18 doctors, 24 nurses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.bedOccupancy}%</div>
            <p className="text-xs text-muted-foreground mt-1">78 of 100 beds occupied</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Indicators */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Today's Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Patient Check-ins</span>
              <span className="font-semibold">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Completed Appointments</span>
              <span className="font-semibold">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Token Payments</span>
              <span className="font-semibold">450 HNT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Referrals Sent</span>
              <span className="font-semibold">3</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Average Wait Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{metrics.avgWaitTime} min</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Emergency</span>
                <span className="font-medium">5 min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Consultation</span>
                <span className="font-medium">20 min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lab Tests</span>
                <span className="font-medium">10 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
              >
                <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                  {activity.type === "appointment" && <Calendar className="h-4 w-4 text-primary" />}
                  {activity.type === "payment" && <Coins className="h-4 w-4 text-primary" />}
                  {activity.type === "referral" && (
                    <ArrowRightLeft className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.patient}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.type === "appointment" && `Appointment ${activity.status}`}
                    {activity.type === "payment" && `Payment received: ${activity.amount}`}
                    {activity.type === "referral" && `Referred to ${activity.hospital}`}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
