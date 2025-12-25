"use client"

import InputField from "./ui/InputField"
import { useState, useMemo, useEffect } from "react"
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants"
import { useChainId, useConfig, useAccount, useWriteContract, useReadContracts } from "wagmi"
import { readContract, waitForTransactionReceipt } from "@wagmi/core"
import { calculateTotal } from "../utils/calculateTotal/calculateTotal"

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")

    const [recipients, setRecipients] = useState("")

    const [amounts, setAmounts] = useState("")

    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()
    const total: number = useMemo(() => calculateTotal(amounts), [amounts])
    const { data: hash, isPending, writeContractAsync } = useWriteContract()
    const { data: readData } = useReadContracts({
        contracts: [
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: 'decimals'
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "name"
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "balanceOf",
                args: [account.address]
            }
        ]
    })

    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => { populateForm() }, [])
    useEffect(() => { storeLocal() }, [tokenAddress, recipients, amounts])

    function storeLocal() {
        localStorage.setItem("tokenAddress", tokenAddress);
        localStorage.setItem("recipients", recipients);
        localStorage.setItem("amounts", amounts);
    }
    function populateForm() {
        if (localStorage.getItem("tokenAddress") != null) {
            setTokenAddress(localStorage.getItem("tokenAddress")!);
        }
        if (localStorage.getItem("recipients") != null) {
            setRecipients(localStorage.getItem("recipients")!);
        }
        if (localStorage.getItem("amounts") != null) {
            setAmounts(localStorage.getItem("amounts")!);
        }
    }

    async function getApprovedAmount(tSenderAddress: String | null): Promise<number> {
        if (!tSenderAddress) {
            alert("No address found, please use a supported chain")
            return 0
        }
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: 'allowance',
            args: [account.address, tSenderAddress as `0x${string}`]
        })

        return response as number
    }
    function Spinner() {
        return (<span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-black dark:border-t-transparent" aria-label="Loading" />)
    }

    async function handleSubmit() {
        // 1a. if already approved, move to step 2
        // 1b. Approve tsender contract to send our tokens
        // 2. Call airdrop function on tsender contract
        // 3. Wait for the transaction to be mined
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        const approvedAmount = await getApprovedAmount(tSenderAddress)
        console.log(approvedAmount)
        setIsSubmitting(true)
        try {

            if (approvedAmount < total) {
                const approvalHash = await writeContractAsync({
                    abi: erc20Abi,
                    address: tokenAddress as `0x${string}`,
                    functionName: 'approve',
                    args: [tSenderAddress as `0x${string}`, BigInt(total)]
                });
                const approvalReceipt = await waitForTransactionReceipt(config, { hash: approvalHash });
                console.log("approval confirmed", approvalReceipt)

                await writeContractAsync({
                    abi: tsenderAbi,
                    address: tSenderAddress as `0x${string}`,
                    functionName: 'airdropERC20',
                    args: [
                        tokenAddress,
                        recipients.split(/[\n,]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                        amounts.split(/[\n,]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                        BigInt(total)
                    ]
                })


            } else {
                await writeContractAsync({
                    abi: tsenderAbi,
                    address: tSenderAddress as `0x${string}`,
                    functionName: 'airdropERC20',
                    args: [
                        tokenAddress,
                        recipients.split(/[\n,]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                        amounts.split(/[\n,]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                        BigInt(total)
                    ]
                })
            }
        } finally {
            setIsSubmitting(false);
        }


    }

    return (
        <div className="px-6 py-6 space-y-5">
            <InputField label="Token Address" placeholder="0x" value={tokenAddress} onChange={e => setTokenAddress(e.target.value)} />
            <InputField label="Recipients" placeholder="0x1234,0x1234567..." value={recipients} onChange={e => setRecipients(e.target.value)} large={true} />
            <InputField label="Amounts" placeholder="100,200,300..." value={amounts} onChange={e => setAmounts(e.target.value)} large={true} />
            <div className="my-4 rounded-xl border border-gray-300 bg-gray-50 p-4 text-gray-700 shadow-sm dark:border-white/15 dark:bg-neutral-900 dark:text-gray-300">
                <b className="block mb-2 text-sm uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Transaction Details
                </b>

                <div className="space-y-1 text-sm">
                    <div>
                        <span className="font-medium">Token Name:</span>{" "}
                        {readData?.[1]?.result as string || "N/A"}
                    </div>
                    <div>
                        <span className="font-medium">Total Amount:</span> {total}
                    </div>
                    <div>
                        <span className="font-medium">Recipients:</span> {recipients}
                    </div>
                </div>
            </div>


            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-black text-white shadow-sm transition hover:shadow-md hover:bg-gray-900 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:focus-visible:ring-white">
                {isSubmitting ? (
                    <>
                        <Spinner />
                        Sending…
                    </>
                ) : (
                    "Send Tokens"
                )}
            </button>


        </div>
    )
}