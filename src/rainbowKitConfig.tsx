"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { anvil, zksync, mainnet } from "wagmi/chains";

export function makeConfig() {
  return getDefaultConfig({
    appName: "Tsender",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [anvil, zksync, mainnet],
    ssr: false,
  });
}
