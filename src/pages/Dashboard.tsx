"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, Info, Check, X } from "lucide-react"
import { ConnectKitButton } from "connectkit"
import { useWriteContract, useSendTransaction, useWaitForTransactionReceipt, type BaseError } from "wagmi"
import { parseUnits } from "viem"
import { fetchExchangeRate, submitPayment } from "./actions/pretium"

interface FormData {
  selectedNetwork: string
  selectedToken: string
  amount: string
  transferType: string
  currency: string
  recipientBank: string
  recipientAccount: string
  memo: string
}

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
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    selectedNetwork: "Base",
    selectedToken: "USDC",
    amount: "0.5000",
    transferType: "bank",
    currency: "Br Ethiopian Birr (ETB)",
    recipientBank: "Select recipient bank",
    recipientAccount: "12345678901",
    memo: "",
  })

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [usdcBalance, setUsdcBalance] = useState("0")
  const [transactionHash, setTransactionHash] = useState("")
  const [transactionData, setTransactionData] = useState<any>(null)
  const [exchangeRate, setExchangeRate] = useState(0)

  const banks = ["Commercial Bank of Ethiopia", "Telebirr", "CBE Birr", "Bank of Abyssinia", "Awash Bank"]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (formData.recipientBank === "Select recipient bank") {
      alert("Please select a recipient bank")
      return
    }

    if (!formData.recipientAccount) {
      alert("Please enter a phone number")
      return
    }

    // Prepare transaction data
    const data = {
      amount: formData.amount,
      token: formData.selectedToken,
      network: formData.selectedNetwork,
      recipientBank: formData.recipientBank,
      recipientAccount: formData.recipientAccount,
      memo: formData.memo,
    }

    setTransactionData(data)
    setShowConfirmModal(true)
  }

  // Wagmi hooks for sending transactions
  const {  data: hash, error: transactionError, isPending: isTransactionPending, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const RECIPIENT_ADDRESS = import.meta.env.VITE_RECIPIENT_ADDRESS
  
  const handleConfirmTransaction = () => {
  

  if (!formData.amount) {
    alert('Please enter an amount')
    return
  }

  try {
    if (!writeContract)
      throw new Error('Wallet not connected or write function unavailable')

    writeContract({
      address: USDC_CONTRACT_ADDRESS,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [RECIPIENT_ADDRESS, parseUnits(formData.amount, 6)], // USDC decimals
    })

    if(hash){
      submitPayment({
        transaction_hash: hash,
        amount: calculateAmount(parseFloat(formData.amount)),
        chain: formData.selectedNetwork,
        shortcode: formData.recipientAccount,
        mobile_network: formData.recipientBank,
      })
    }
  } catch (err) {
    console.error('Transaction error:', err)
    alert(`Transaction error: ${(err as Error).message}`)
  }
}

  
  const updateRate = async () => {
  try {
    const result = await fetchExchangeRate() // await the Promise
    const { rate, success } = result
    if (success) {
      setExchangeRate(rate)
    } else {
      console.error("Failed to fetch rate:", (result as any).error)
    }
  } catch (err) {
    console.error("Error fetching rate:", err)
  }
}

  function calculateAmount(amount: number) {
    return amount * exchangeRate;
  }
  useEffect(() => {
    updateRate()
    
    
    if (isConfirmed && showConfirmModal) {
      setShowConfirmModal(false)
      setShowSuccessModal(true)
      setTransactionHash(hash || "")
    }
  }, [isConfirmed, showConfirmModal, hash])

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
        <div className="flex items-center space-x-3">
          <ConnectKitButton />
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        {/* Main content */}
        <div className="max-w-5xl mx-auto px-4 py-3 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left panel */}
          <div className="bg-gray-800/50 rounded-xl p-5">
            {/* Network selection */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <button
                type="button"
                className="flex items-center px-3 py-1.5 rounded-full text-sm bg-lime-400 text-gray-900"
              >
                <Check size={14} className="mr-1" />
                Base
              </button>
            </div>

            {/* Token selection */}
            <div className="mb-4">
              <label className="block text-xs font-medium mb-1.5">
                Token <span className="text-lime-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="selectedToken"
                  value={formData.selectedToken}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-lime-400"
                  required
                >
                  <option value="USDC">USDC</option>
                  <option value="ETH">ETH</option>
                  <option value="BTC">BTC</option>
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
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                required
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
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-lime-400"
                  required
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
                  name="recipientBank"
                  value={formData.recipientBank}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-lime-400"
                  required
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
                  name="recipientAccount"
                  value={formData.recipientAccount}
                  onChange={handleInputChange}
                  placeholder="+251 91 234 5678"
                  maxLength={12}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                  {formData.recipientAccount.length}/12
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action button */}
        <div className="max-w-5xl mx-auto px-4 py-5">
          <button
            type="submit"
            className="w-full bg-lime-400 text-gray-900 font-semibold py-3 rounded-full hover:bg-lime-300 transition-all duration-300 text-sm"
          >
            Review info
          </button>
        </div>
      </form>

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
                    {transactionData?.amount} {transactionData?.token}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-white">{transactionData?.network}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Recipient:</span>
                  <span className="text-white">{transactionData?.recipientBank}</span>
                </div>
              
              </div>

              {hash && (
                <div className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Transaction Hash:</div>
                  <div className="text-xs text-white break-all">{hash}</div>
                </div>
              )}

              {isConfirming && <div className="text-center text-lime-400 text-sm">Waiting for confirmation...</div>}

              {isConfirmed && (
                <div className="text-center text-lime-400 text-sm flex items-center justify-center">
                  <Check size={16} className="mr-2" />
                  Transaction confirmed!
                </div>
              )}

              {transactionError && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <div className="text-red-400 text-sm">
                    Error: {(transactionError as BaseError).shortMessage || transactionError.message}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleConfirmTransaction}
              disabled={isTransactionPending || isConfirming}
              className="w-full bg-lime-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-lime-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTransactionPending ? "Confirming in wallet..." : isConfirming ? "Processing..." : "Confirm & Send"}
            </button>
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
              <p className="text-gray-400 mb-6">Your Send ETB transaction has been processed successfully.</p>
              {transactionHash && (
                <div className="bg-gray-700/50 rounded-lg p-3 mb-6">
                  <div className="text-xs text-gray-400 mb-1">Transaction Hash:</div>
                  <div className="text-xs text-white break-all">{transactionHash}</div>
                </div>
              )}
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

      {/* Transaction Success Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md relative border border-gray-700/50 shadow-2xl">
            <button
              onClick={() => setShowTransactionModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-lime-400/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-lime-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Transaction Sent!</h3>
              <p className="text-gray-400 mb-4">Your USDC transaction has been submitted to the Base network.</p>
              {transactionHash && <p className="text-xs text-gray-500 mb-6 break-all">TX: {transactionHash}</p>}
              <button
                onClick={() => setShowTransactionModal(false)}
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
