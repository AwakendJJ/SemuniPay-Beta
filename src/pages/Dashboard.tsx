import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useAccount, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import {
  ChevronDown,
  Info,
  Check,
  ArrowLeft,
  CreditCard,
  Send,
  X,
} from "lucide-react";
import { erc20Abi } from "../components/ContractAbi";

const PRETIUM_API_KEY = import.meta.env.VITE_PRETIUM_API_KEY;
const USDC_CONTRACT_ADDRESS =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`;
const Dashboard: React.FC = () => {
  const networkTokens: Record<string, string[]> = {
    Base: ["USDC"],
    Celo: ["cUSD", "USDC", "USDT"],
    Stellar: ["USDC"],
  };

  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { chains, switchChain } = useSwitchChain();
  const chainId = useChainId();

  const navigate = useNavigate();

  const currentChain = chains.find((c) => c.id === chainId);

  // Mode toggle (spend or buy crypto)
  const [mode, setMode] = useState<"spend" | "buy">("spend");

  // State for form fields - Spend Crypto
  const [selectedNetwork, setSelectedNetwork] = useState(currentChain?.name ?? "Base");
  const [selectedToken, setSelectedToken] = useState("USDC");
  const [amount, setAmount] = useState("0.5000");
  const [transferType, setTransferType] = useState("bank");
  const [currency, setCurrency] = useState("Br Ethiopian Birr (ETB)");
  const [recipientBank, setRecipientBank] = useState("Select recipient bank");
  const [recipientAccount, setRecipientAccount] = useState("12345678901");
  const [memo, setMemo] = useState("");
  const [usdcAmount, setUsdcAmount] = useState("");
  const [availableTokens, setAvailableTokens] = useState<string[]>(networkTokens[selectedNetwork]);

  // Additional state for Buy Crypto
  const [depositFrom, setDepositFrom] = useState("Commercial Bank of Ethiopia");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const recipient = "0x8005ee53E57aB11E11eAA4EFe07Ee3835Dc02F98"; // Replace with actual recipient address

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  


 async function fetchExchangeRate() {
    const url = "https://pretium-api-proxy.onrender.com/api/v1/exchange-rate/";
    const data = { currency_code: "ETB" };
    try {
      const response = await fetch(url, {
        method: "POST",
       headers: {
            'Content-Type': 'application/json',
            'x-api-key': PRETIUM_API_KEY,
          },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      const sellingRate = parseFloat(result.data.selling_rate);
      setExchangeRate(sellingRate); // ← set state here
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  }

  function calculateAmount(amount: number) {
    return amount * exchangeRate;
  }

  useEffect(() => {
    const currentChainName = chains.find((c) => c.id === chainId)?.name;
    if (currentChainName) {
      setSelectedNetwork(currentChainName);
    }
    console.log("Chain ID changed: ", chainId)
  }, [chainId, chains]);

  useEffect(() => {
     fetchExchangeRate();
    if (window.ethereum) {
      setProvider(new ethers.providers.Web3Provider(window.ethereum));
    } else {
      setProvider(null);
      // Optionally show a message to the user
      // alert("No Ethereum wallet detected. Please install MetaMask.");
    }
  }, []);

  useEffect(() => {
    const tokens = networkTokens[selectedNetwork] || [];
    setAvailableTokens(tokens);
    // If the currently selected token is not in the new list, update it to the first available token.
    if (!tokens.includes(selectedToken)) {
      setSelectedToken(tokens[0] || "");
    }
  }, [selectedNetwork, selectedToken]); // Removed networkTokens and setSelectedToken from dependencies as they are stable.

  const handleDisconnect = () => {
    console.log("handleDisconnect")
    disconnect();
  };

  // Format wallet address to show first 6 and last 4 characters
  const formatWalletAddress = (wallet_address: string) => {
    if (!wallet_address) return "";
    return `${wallet_address.substring(0, 6)}...${wallet_address.substring(
      wallet_address.length - 4
    )}`;
  };

  const banks = [
    "Commercial Bank of Ethiopia",
    "Telebirr",
    "CBE Birr",
    "Bank of Abyssinia",
    "Awash Bank",
  ];

  const handleReviewInfo = () => {
    const data = {
      mode,
      amount: usdcAmount,
      token: selectedToken,
      network: selectedNetwork,
      recipientBank: mode === "spend" ? recipientBank : depositFrom,
      recipientAccount: mode === "spend" ? recipientAccount : phoneNumber,
      memo,
    };
    setTransactionData(data);
    setShowConfirmModal(true);
  };
  const handleUsdcAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setUsdcAmount(value);
    }
  };


  const handleConfirmTransaction = async () => {
    if (!window.ethereum) {
      console.error("No wallet found.");
      return;
    }

    setShowConfirmModal(false);
    const signer = await provider?.getSigner();

    const usdcValue = parseFloat(usdcAmount);
    if (isNaN(usdcValue) || usdcValue <= 0) {
      console.log("Invalid USDC amount");
      // return;
    }
    const usdc = new ethers.Contract(USDC_CONTRACT_ADDRESS, erc20Abi, signer);
    // ...existing code...
    const amountInUnits = ethers.utils.parseUnits(usdcValue.toFixed(6), 6); // USDC has 6 decimals
    // ...existing code...
    let TransactionHash;
    try {
      const tx = await usdc.transfer(recipient, amountInUnits);
      TransactionHash = tx.hash;

      console.log("Transfer tx sent:", tx.hash);
      await tx.wait();
      console.log(`✅ Sent ${usdcAmount} USDC to ${recipient}`);

    } catch (error) {
      console.error("Transfer failed:", error);
    }
    const body = {
          transaction_hash: TransactionHash,
          amount: calculateAmount(transactionData.amount),
          shortcode: transactionData.recipientAccount,
          mobile_network: transactionData.recipientBank,
          chain: transactionData.network.toUpperCase(),
         
        };
        if(TransactionHash){
        let response = await fetch(`https://pretium-api-proxy.onrender.com/api/v1/pay/ETB`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': PRETIUM_API_KEY,
          },
          body: JSON.stringify(body),
        });
        console.log(response)
        }

        

    setTimeout(() => {
      setShowSuccessModal(true);
    }, 1000);
  };

  // const handleConfirmTransaction = async () => {
  //   if (!window.ethereum || !provider) {
  //     console.error("No wallet/provider found.");
  //     return;
  //   }

  //   setShowConfirmModal(false);

  //   try {
  //     const signer = await provider.getSigner();

  //     // Use the correct state variable (amount instead of usdcAmount)
  //     const usdcValue = parseFloat(amount);
  //     if (isNaN(usdcValue) || usdcValue <= 0) {
  //       console.error("Invalid USDC amount");
  //       return;
  //     }

  //     // Contract instance
  //     const usdc = new ethers.Contract(USDC_CONTRACT_ADDRESS, erc20Abi, signer);

  //     // Correct parseUnits depending on ethers version
  //     const amountInUnits =
  //       ethers?.utils?.parseUnits?.(usdcValue.toFixed(6), 6) ?? // ethers v5
  //       ethers.parseUnits(usdcValue.toFixed(6), 6); // ethers v6 fallback

  //     // Send transaction
  //     const tx = await usdc.transfer(recipient, amountInUnits);
  //     console.log("📤 Transfer tx sent:", tx.hash);

  //     const receipt = await tx.wait();
  //     console.log(`✅ Sent ${usdcValue} USDC to ${recipient}`);
  //     console.log("📜 Receipt:", receipt);

  //     setShowSuccessModal(true);
  //   } catch (error) {
  //     console.error("❌ Transfer failed:", error);
  //   }
  // };
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <span className="text-gray-900 font-bold text-lg">S</span>
          </div>
          <div className="text-lime-400 font-semibold text-2xl tracking-wide">
            SemuniPay
          </div>
        </div>
        {address ? (
          <div className="flex items-center space-x-3">
          <div className="bg-gray-800 text-lime-400 font-medium px-4 py-2 rounded-full border border-gray-700">
            {formatWalletAddress(address)}
          </div>
           <button
    className="bg-lime-400 text-gray-900 font-semibold px-6 py-2 rounded-full hover:bg-lime-300 transition-all duration-300"
    onClick={() => handleDisconnect()}
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

      {/* Mode Toggle */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-3">
        <div className="grid grid-cols-2 gap-2 bg-gray-800 rounded-lg p-1 max-w-xs mx-auto">
          <button
            className={`py-1.5 rounded-lg flex items-center justify-center text-sm ${
              mode === "spend" ? "bg-lime-400 text-gray-900" : "text-white"
            }`}
            onClick={() => setMode("spend")}
          >
            <Send size={16} className="mr-1.5" />
            Spend Crypto
          </button>
          <button
            className={`py-1.5 rounded-lg flex items-center justify-center text-sm ${
              mode === "buy" ? "bg-lime-400 text-gray-900" : "text-white"
            }`}
            onClick={() => setMode("buy")}
          >
            <CreditCard size={16} className="mr-1.5" />
            Buy Crypto
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-3 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left panel */}
        <div className="bg-gray-800/50 rounded-xl p-5">
          {mode === "spend" ? (
            <>
              {/* Network selection - Spend Crypto */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                {chains.map((chain) => (
                  <button
                    key={chain.id}
                    className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
                      chain.id === currentChain?.id
                        ? "bg-lime-400 text-gray-900"
                        : "bg-gray-700 text-white"
                    }`}
                    onClick={() => switchChain?.({ chainId: chain.id })}
                  >
                    {chain.id === currentChain?.id && (
                      <Check size={14} className="mr-1" />
                    )}
                    {chain.name}
                  </button>
                ))}

                <button className="flex items-center px-3 py-1.5 rounded-full bg-gray-700 text-white text-sm">
                  More <ChevronDown size={14} className="ml-1" />
                </button>
              </div>

              {/* Token selection - Spend Crypto */}
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
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              {/* Amount input - Spend Crypto */}
              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Amount <span className="text-lime-400">*</span>
                </label>
                <input
                  type="text"
                  value={usdcAmount}
                  onChange={handleUsdcAmountChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
            </>
          ) : (
            <>
              {/* Token selection - Buy Crypto */}
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1.5">
                  Token to Buy <span className="text-lime-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-lime-400"
                  >
                    <option value="USDC">USDC</option>
                    <option value="ETH">ETH</option>
                    <option value="BTC">BTC</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              {/* Amount input - Buy Crypto */}
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1.5">
                  Amount <span className="text-lime-400">*</span>
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>

              {/* Deposit From - Buy Crypto */}
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1.5">
                  Deposit From <span className="text-lime-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={depositFrom}
                    onChange={(e) => setDepositFrom(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-lime-400"
                  >
                    {banks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              {/* Phone Number - Buy Crypto */}
              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Phone Number <span className="text-lime-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+251 91 234 5678"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                    0/12
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right panel */}
        <div className="bg-gray-800/50 rounded-xl p-5">
          {mode === "spend" ? (
            <>
              {/* Recipient details - Spend Crypto */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-medium">Recipient details</h2>
                <Info size={16} className="text-gray-400" />
              </div>

              {/* Transfer type tabs - Spend Crypto */}
              <div className="grid grid-cols-2 gap-1 bg-gray-700 rounded-lg p-1 mb-4">
                <button
                  className={`py-1.5 rounded-lg text-sm ${
                    transferType === "bank" ? "bg-gray-600" : ""
                  }`}
                  onClick={() => setTransferType("bank")}
                >
                  Bank transfer
                </button>
                <button
                  className={`py-1.5 rounded-lg text-sm ${
                    transferType === "mobile" ? "bg-gray-600" : ""
                  }`}
                  onClick={() => setTransferType("mobile")}
                >
                  Mobile money
                </button>
              </div>

              {/* Currency selection - Spend Crypto */}
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
                    <option value="Br Ethiopian Birr (ETB)">
                      Br Ethiopian Birr (ETB)
                    </option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              {/* Recipient Bank - Spend Crypto */}
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
                    <option value="Select recipient bank">
                      Select recipient bank
                    </option>
                    {banks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              {/* Recipient Account - Spend Crypto */}
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1.5">
                  Recipient Account <span className="text-lime-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={recipientAccount}
                    onChange={(e) => setRecipientAccount(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                    0/10
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Transaction Summary - Buy Crypto */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-medium">Transaction Summary</h2>
                <Info size={16} className="text-gray-400" />
              </div>

              <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-400">You pay</span>
                  <span className="font-medium">25,000 ETB</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-400">Exchange rate</span>
                  <span className="font-medium">1 USDC ≈ 50 ETB</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-400">Fee</span>
                  <span className="font-medium">250 ETB</span>
                </div>
                <div className="border-t border-gray-600 my-2"></div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">You receive</span>
                  <span className="font-medium text-lime-400">
                    {usdcAmount}USDC
                  </span>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <div className="bg-gray-600 p-1.5 rounded-full mr-2 flex-shrink-0">
                    <Info size={14} className="text-gray-300" />
                  </div>
                  <p className="text-xs text-gray-300">
                    Funds will be deposited to your wallet after your payment is
                    confirmed. This typically takes 5-10 minutes.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Memo field for both modes */}
          <div>
            <label className="block text-xs font-medium mb-1.5">
              Memo <span className="text-lime-400">*</span>
            </label>
            <div className="relative">
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Enter memo"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 resize-none h-16"
              />
              <span className="absolute right-3 bottom-2 text-gray-400 text-xs">
                0/25
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action button */}
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex space-x-4">
          <button
            onClick={handleReviewInfo}
            className="flex-1 bg-lime-400 text-gray-900 font-semibold py-3 rounded-full hover:bg-lime-300 transition-all duration-300 text-sm"
          >
            Review info
          </button>
          <button
            onClick={() => navigate("/virtual-cards")}
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 text-white font-semibold py-3 px-6 rounded-full hover:bg-gray-800/50 transition-all duration-300 text-sm flex items-center"
          >
            <CreditCard size={16} className="mr-2" />
            Virtual Cards
          </button>
        </div>
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
              <h3 className="text-2xl font-bold text-white mb-2">
                Confirm Transaction
              </h3>
              <p className="text-gray-400">
                Please review your transaction details
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Action:</span>
                  <span className="text-white capitalize">
                    {transactionData?.mode} Crypto
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">{usdcAmount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-white">{transactionData?.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {transactionData?.mode === "spend" ? "Recipient:" : "From:"}
                  </span>
                  <span className="text-white">
                    {transactionData?.recipientBank}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-white py-3 rounded-lg hover:bg-gray-700/70 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTransaction}
                className="flex-1 bg-lime-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-lime-300 transition-all duration-300"
              >
                Confirm
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
              <h3 className="text-2xl font-bold text-white mb-2">
                Transaction Successful!
              </h3>
              <p className="text-gray-400 mb-6">
                Your {transactionData?.mode} transaction has been processed
                successfully.
              </p>
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
  );
};

export default Dashboard;
