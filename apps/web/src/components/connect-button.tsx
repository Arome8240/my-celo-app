"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const RainbowKitConnectButton = dynamic(
  () => import("@rainbow-me/rainbowkit").then((mod) => mod.ConnectButton),
  { ssr: false }
);

export function ConnectButton() {
  const [isMinipay, setIsMinipay] = useState(false);

  useEffect(() => {
    // @ts-ignore
    if (window.ethereum?.isMiniPay) {
      setIsMinipay(true);
    }
  }, []);

  if (isMinipay) {
    return null;
  }

  return <RainbowKitConnectButton />;
}
