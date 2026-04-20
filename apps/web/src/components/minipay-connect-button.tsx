"use client";

import { useMemo } from "react";
import { Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { truncateAddress } from "@/lib/app-utils";
import { useMiniPay } from "@/hooks/useMiniPay";

interface MiniPayConnectButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function MiniPayConnectButton({
  className,
  size = "lg",
}: MiniPayConnectButtonProps) {
  const { isMiniPay, address, isConnected, connect } = useMiniPay();

  const label = useMemo(() => {
    if (!isMiniPay) return "Open in MiniPay";
    if (isConnected && address) return `MiniPay: ${truncateAddress(address)}`;
    return "Connect MiniPay";
  }, [address, isConnected, isMiniPay]);

  return (
    <Button
      size={size}
      className={cn("px-8 py-3 text-base font-medium", className)}
      onClick={() => void connect()}
      disabled={!isMiniPay || isConnected}
    >
      <Smartphone className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
