"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { type ReactNode, useEffect, useState } from "react";
import { makeConfig } from "@/rainbowKitConfig";

let cachedConfig: ReturnType<typeof makeConfig> | null = null;

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [config, setConfig] = useState<ReturnType<typeof makeConfig> | null>(null);

  useEffect(() => {
    if (!cachedConfig) cachedConfig = makeConfig();
    setConfig(cachedConfig);
  }, []);

  // ✅ Block rendering until WagmiProvider exists
  if (!config) {
    return (
      <div style={{ padding: 16 }}>
        Loading…
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
