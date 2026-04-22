"use client";

import { useAccount } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AdminOverview } from "@/components/admin/admin-overview";
import { RoleManagement } from "@/components/admin/role-management";
import { TokenMinting } from "@/components/admin/token-minting";
import { EmergencyControls } from "@/components/admin/emergency-controls";
import { MiniPayConnectButton } from "@/components/minipay-connect-button";
import { LayoutDashboard, Shield, Coins, AlertTriangle } from "lucide-react";

export default function AdminPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Connect your wallet to access the Hospital Network Token admin panel
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
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Hospital Network Token Management
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-full sm:w-auto min-w-max">
            <TabsTrigger value="overview" className="flex items-center gap-2 text-xs sm:text-sm">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2 text-xs sm:text-sm">
              <Shield className="h-4 w-4" />
              <span>Roles</span>
            </TabsTrigger>
            <TabsTrigger value="minting" className="flex items-center gap-2 text-xs sm:text-sm">
              <Coins className="h-4 w-4" />
              <span className="hidden sm:inline">Minting</span>
              <span className="sm:hidden">Mint</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2 text-xs sm:text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Emergency</span>
              <span className="sm:hidden">Alert</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <AdminOverview />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RoleManagement />
        </TabsContent>

        <TabsContent value="minting" className="space-y-4">
          <TokenMinting />
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <EmergencyControls />
        </TabsContent>
      </Tabs>
    </div>
  );
}
