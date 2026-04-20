import type { Hex } from "viem";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const CELO_MAINNET_CHAIN_ID = "0xa4ec";

async function getMiniPayAccount(provider: EthereumProvider) {
  const accounts = (await provider.request({ method: "eth_accounts" })) as `0x${string}`[];
  if (accounts?.[0]) return accounts[0];

  const requestedAccounts = (await provider.request({ method: "eth_requestAccounts" })) as `0x${string}`[];
  return requestedAccounts?.[0];
}

function getRpcErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export async function sendMiniPayTransaction(to: `0x${string}`, data: Hex) {
  if (typeof window === "undefined" || !window.ethereum?.request) {
    throw new Error("MiniPay provider not found.");
  }

  const chainId = (await window.ethereum.request({ method: "eth_chainId" })) as string;
  if (chainId?.toLowerCase() !== CELO_MAINNET_CHAIN_ID) {
    throw new Error("MiniPay is not on Celo mainnet. Turn off Developer Settings -> Use Testnet and reopen the Mini App.");
  }

  const account = await getMiniPayAccount(window.ethereum);
  if (!account) {
    throw new Error("MiniPay account not found.");
  }

  const request = {
    from: account,
    to,
    data,
  };

  try {
    return (await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [request],
    })) as `0x${string}`;
  } catch (error) {
    throw new Error(`MiniPay rejected transaction: ${getRpcErrorMessage(error)}`);
  }
}
