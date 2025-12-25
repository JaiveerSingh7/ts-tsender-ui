"use client"

import { useState } from "react"
import AirdropForm from "@/components/AirdropForm"
import { useAccount } from "wagmi"

export default function HomeContent() {
    const [isUnsafeMode, setIsUnsafeMode] = useState(false)
    const { isConnected } = useAccount()

    return (
        <main>
            {!isConnected ? (
                <div className="flex items-center justify-center">
                    <h2 className="text-xl font-medium text-zinc-600">
                        Please connect a wallet...
                    </h2>
                </div>
            ) : (
                <div >
                    <AirdropForm isUnsafeMode={isUnsafeMode} onModeChange={setIsUnsafeMode} />
                </div>
            )}
        </main>
    )
}