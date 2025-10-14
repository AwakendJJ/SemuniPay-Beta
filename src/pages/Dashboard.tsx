"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import {
  useAccount,
  useDisconnect,
  useChainId,
  useSwitchChain,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi"
import { parseUnits } from "viem"
import { encodeFunctionData } from "viem/utils"
import { ChevronDown, Info, Check, X } from "lucide-react"
import { fetchExchangeRate, submitPayment } from "./actions/pretium"

const USDC_CONTRACT_ADDRESS =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`;
const erc20Abi = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const

const Dashboard: React.FC = () => {
  const networkTokens: Record<string, string[]> = {
    Base: ["USDC"],
    // Celo: ["cUSD", "USDC", "USDT"],
    // Stellar: ["USDC"],
  }

  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { chains, switchChain } = useSwitchChain()
  const chainId = useChainId()
  const navigate = useNavigate()

  const currentChain = chains.find((c) => c.id === chainId)

  const [selectedNetwork, setSelectedNetwork] = useState(currentChain?.name ?? "Base")
  const [selectedToken, setSelectedToken] = useState("USDC")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("Br Ethiopian Birr (ETB)")
  const [recipientBank, setRecipientBank] = useState("Select recipient bank")
  const [recipientAccount, setRecipientAccount] = useState("")
  const [memo, setMemo] = useState("")
  const [availableTokens, setAvailableTokens] = useState<string[]>(networkTokens[selectedNetwork])

  const recipient =  import.meta.env.VITE_RECIPIENT_ADDRESS as `0x${string}`

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [transactionData, setTransactionData] = useState<any>(null)

  const [exchangeRate, setExchangeRate] = useState<number>(0)

  const { data: hash, isPending, sendTransaction, error } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  async function loadExchangeRate() {
    const result = await fetchExchangeRate("ETB")
    if (result.success) {
      setExchangeRate(result.rate)
    } else {
      console.error("Failed to fetch exchange rate:", result.error)
    }
  }

  function calculateAmount(amount: number) {
    return amount * exchangeRate
  }

  useEffect(() => {
    const currentChainName = chains.find((c) => c.id === chainId)?.name
    if (currentChainName) {
      setSelectedNetwork(currentChainName)
    }
  }, [chainId, chains])

  useEffect(() => {
    loadExchangeRate()
  }, [])

  useEffect(() => {
    const tokens = networkTokens[selectedNetwork] || []
    setAvailableTokens(tokens)
    if (!tokens.includes(selectedToken)) {
      setSelectedToken(tokens[0] || "")
    }
  }, [selectedNetwork, selectedToken])

  useEffect(() => {
    async function handleTransactionSuccess() {
      if (isConfirmed && hash && transactionData) {
        console.log("[v0] Transaction confirmed:", hash)

        const paymentData = {
          transaction_hash: hash,
          amount: calculateAmount(transactionData.amount),
          shortcode: transactionData.recipientAccount,
          mobile_network: transactionData.recipientBank,
          chain: transactionData.network.toUpperCase(),
        }

        const result = await submitPayment(paymentData)
        console.log("[v0] Pretium API response:", result)

        setShowSuccessModal(true)
      }
    }

    handleTransactionSuccess()
  }, [isConfirmed, hash, transactionData])

  const handleDisconnect = () => {
    disconnect()
  }

  const formatWalletAddress = (wallet_address: string) => {
    if (!wallet_address) return ""
    return `${wallet_address.substring(0, 6)}...${wallet_address.substring(wallet_address.length - 4)}`
  }

  const banks = ["Commercial Bank of Ethiopia", "Telebirr", "CBE Birr", "Bank of Abyssinia", "Awash Bank"]

  const handleReviewInfo = () => {
    const data = {
      amount,
      token: selectedToken,
      network: selectedNetwork,
      recipientBank,
      recipientAccount,
      memo,
    }
    setTransactionData(data)
    setShowConfirmModal(true)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handleConfirmTransaction = async () => {
    const usdcValue = Number.parseFloat(amount)

    if (isNaN(usdcValue) || usdcValue <= 0) {
      console.error("Invalid USDC amount")
      return
    }

    setShowConfirmModal(false)

    const amountInUnits = parseUnits(usdcValue.toFixed(6), 6)

    console.log("Sending transaction:", {
      to: recipient,
      amount: amountInUnits.toString(),
      contract: USDC_CONTRACT_ADDRESS,
    })

    sendTransaction({
      to: recipient,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "transfer",
        args: [recipient, amountInUnits],
      }),
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <span className="text-gray-900 font-bold text-lg">S</span>
          </div>
          <div className="text-lime-400 font-semibold text-2xl tracking-wide">SemuniPay</div>
        </div>
        {address ? (
          <div className="flex items-center space-x-3">
            <div className="bg-gray-800 text-lime-400 font-medium px-4 py-2 rounded-full border border-gray-700">
              {formatWalletAddress(address)}
            </div>
            <button
              className="bg-lime-400 text-gray-900 font-semibold px-6 py-2 rounded-full hover:bg-lime-300 transition-all duration-300"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            className="bg-lime-400 text-gray-900 font-semibold px-6 py-2 rounded-full hover:bg-lime-300 transition-all duration-300"
            onClick={() => navigate("/connect")}
          >
            Connect
          </button>
        )}
      </header>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-3 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left panel */}
        <div className="bg-gray-800/50 rounded-xl p-5">
          {/* Network selection */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            
              <button
                key={chains[0].id}
                className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                  chains[0].id === currentChain?.id ? "bg-lime-400 text-gray-900" : "bg-gray-700 text-white"
                }`}
                onClick={() => switchChain?.({ chainId: chains[0].id })}
              >
                {chains[0].id === currentChain?.id && <Check size={14} className="mr-1" />}
                {chains[0].name}
              </button>
            
            {/* <button className="flex items-center px-3 py-1.5 rounded-full bg-gray-700 text-white text-sm">
              More <ChevronDown size={14} className="ml-1" />
            </button> */}
          </div>

          {/* Token selection */}
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5">
              Token <span className="text-lime-400">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                {availableTokens.map((token) => (
                  <option key={token} value={token}>
                    {token}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-medium mb-1.5">
              Amount <span className="text-lime-400">*</span>
            </label>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="bg-gray-800/50 rounded-xl p-5">
          {/* Recipient details */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-medium">Recipient details</h2>
            <Info size={16} className="text-gray-400" />
          </div>

          {/* Mobile Money Label */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-300">Mobile Money Transfer</div>
          </div>

          {/* Currency selection */}
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5">
              Currency <span className="text-lime-400">*</span>
            </label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                <option value="Br Ethiopian Birr (ETB)">Br Ethiopian Birr (ETB)</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Recipient Bank */}
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5">
              Recipient Bank <span className="text-lime-400">*</span>
            </label>
            <div className="relative">
              <select
                value={recipientBank}
                onChange={(e) => setRecipientBank(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                <option value="Select recipient bank">Select recipient bank</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Recipient Account */}
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5">
              Phone Number <span className="text-lime-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={recipientAccount}
                onChange={(e) => setRecipientAccount(e.target.value)}
                placeholder="+251 91 234 5678"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                {recipientAccount.length}/12
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action button */}
      <div className="max-w-5xl mx-auto px-4 py-5">
        <button
          onClick={handleReviewInfo}
          disabled={isPending || isConfirming}
          className="w-full bg-lime-400 text-gray-900 font-semibold py-3 rounded-full hover:bg-lime-300 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Confirming..." : isConfirming ? "Processing..." : "Review info"}
        </button>
        {error && <div className="mt-2 text-red-400 text-sm text-center">Error: {error.message}</div>}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md relative border border-gray-700/50 shadow-2xl">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Confirm Transaction</h3>
              <p className="text-gray-400">Please review your transaction details</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Action:</span>
                  <span className="text-white">Send ETB</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">
                    {amount} {transactionData?.token}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-white">{transactionData?.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Recipient:</span>
                  <span className="text-white">{transactionData?.recipientBank}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white">{transactionData?.recipientAccount}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isPending}
                className="flex-1 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-white py-3 rounded-lg hover:bg-gray-700/70 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTransaction}
                disabled={isPending}
                className="flex-1 bg-lime-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-lime-300 transition-all duration-300 disabled:opacity-50"
              >
                {isPending ? "Confirming..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md relative border border-gray-700/50 shadow-2xl">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-lime-400/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-lime-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Transaction Successful!</h3>
              <p className="text-gray-400 mb-4">
                Your USDC transaction has been submitted to the {transactionData?.network} network.
              </p>
              {hash && <p className="text-xs text-gray-500 mb-6 break-all">TX: {hash}</p>}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-lime-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-lime-300 transition-all duration-300"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
