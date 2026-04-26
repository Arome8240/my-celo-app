import { getWebEnv } from "@my-celo-app/config";

// Get validated environment
const env = getWebEnv();

export const CONTRACT_ADDRESS = env.NEXT_PUBLIC_HOSPITAL_TOKEN_ADDRESS;
export const CELO_RPC = env.NEXT_PUBLIC_CELO_RPC_URL;
export const MINIPAY_FEE_CURRENCY = "0x765DE816845861e75A25fCA122bb6898B8B1282a" as const;

export function shortenAddress(addr: string, head = 6, tail = 4): string {
  if (!addr) return "";
  return `${addr.slice(0, head)}...${addr.slice(-tail)}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

// cfg: 1775240004148

// cfg: 1775273106983

// cfg: 1775286168924

// cfg: 1775383701875

// cfg: 1775390144583

// cfg: 1775437448527

// cfg: 1775511122622

// cfg: 1775598820450

// cfg: 1775643684445

// cfg: 1775695612006

// cfg: 1775710795800

// cfg: 1775796365604

// cfg: 1775828121853

// cfg: 1775871085918

// cfg: 1775919947948

// cfg: 1775966270118

// cfg: 1776046250310

// cfg: 1776062501326

// cfg: 1776083751667

// cfg: 1776115789597

// cfg: 1776143638507

// cfg: 1776170350450

// cfg: 1776185898635

// cfg: 1776214955655

// cfg: 1776247530021

// cfg: 1776256138234

// cfg: 1776269327599

// cfg: 1776315219746

// cfg: 1776330813876

// cfg: 1776349109790

// cfg: 1776372462589

// cfg: 1776400578840

// cfg: 1776431515847

// cfg: 1776459241621

// cfg: 1776478729812

// cfg: 1776492689447

// cfg: 1776517357920

// cfg: 1776548845868

// cfg: 1776584419460

// cfg: 1776618269269

// cfg: 1776643521975
