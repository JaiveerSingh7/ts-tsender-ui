"use client"

import {QueryClient, QueryClientContext, QueryClientProvider} from "@tanstack/react-query"
import {RainbowKitProvider, ConnectButton} from "@rainbow-me/rainbowkit"
import { type ReactNode, useState } from "react"
import config from "@/rainbowKitConfig"
import { WagmiProvider } from "wagmi"
import "@rainbow-me/rainbowkit/styles.css"

export function Providers(props: {children: ReactNode}){
    const [queryClient] = useState(() => new QueryClient())
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client = {queryClient}>
                <RainbowKitProvider>
                    {props.children}           
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}