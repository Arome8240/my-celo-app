"use client";

import { useAccount } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { HospitalDashboard } from "@/components/hospital/hospital-dashboard";
import { PatientRegistration } from "@/components/hospital/patient-registration";
import { AppointmentScheduling } from "@/components/hospital/appointment-scheduling";
import { TokenPayments } from "@/components/hospital/token-payments";
import { MiniPayConnectButton } from "@/components/minipay-connect-button";
import { Building2, LayoutDashboard, Users, Calendar, Coins } from "lucide-react";

export default function HospitalPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Hospital Dashboard</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Connect your wallet to access hospital management features
              </p>
              <MiniPayConnectButton />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Hospital Management</h1>
            <p className="text-sm text-muted-foreground">
              Multi-Hospital Network Operations
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-4">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-full sm:w-auto min-w-max">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 text-xs sm:text-sm">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2 text-xs sm:text-sm">
              <Users className="h-4 w-4" />
              <span>Patients</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2 text-xs sm:text-sm">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Appointments</span>
              <span className="sm:hidden">Appts</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2 text-xs sm:text-sm">
              <Coins className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
              <span className="sm:hidden">Pay</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-4">
          <HospitalDashboard />
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <PatientRegistration />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <AppointmentScheduling />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <TokenPayments />
        </TabsContent>
      </Tabs>
    </div>
  );
}
