import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Info, Check, ArrowLeft, CreditCard, Send, X, Clock, RefreshCw, ChevronUp } from 'lucide-react';
import USDC from '../Images/USDC.png';
import ETB from '../Images/ETB.jpeg';
import Telebirr from '../Images/Telebirr.png';
import SemuniLogo from '../Images/semunipaylogo.png';
import { ConnectKitButton } from 'connectkit';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { fetchExchangeRate, submitPayment } from './actions/pretium';
import { base } from 'wagmi/chains'
import { parseUnits } from 'viem';
import { BasenameConnectButton } from "../components/BaseNameConnectButton";
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';
import { OFF_RAMP_DISABLED } from '../config';


const USDC_CONTRACT_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`
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
  
  
  // State for form fields
  const [youPayAmount, setYouPayAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [youReceiveAmount, setYouReceiveAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('ETB');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [conversionDirection, setConversionDirection] = useState<'pay' | 'receive'>('pay');

  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState('0');
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionData, setTransactionData] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  

  const { data: hash, error: transactionError, isPending: isTransactionPending, writeContractAsync } = useWriteContract()

  const updateRate = async () => {
    try {
      const result = await fetchExchangeRate() 
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

   

  useEffect(() => {
    updateRate()
  }, [])

  useEffect(() => {
  if (exchangeRate <= 0) return;

  if (conversionDirection === 'pay') {
    const payAmount = parseFloat(youPayAmount) || 0;
    const receiveAmount = payAmount * exchangeRate;
    if(receiveAmount > 0){
    setYouReceiveAmount(receiveAmount ? receiveAmount.toFixed(2) : '0.00');
    }
  } else {
    const receiveAmount = parseFloat(youReceiveAmount) || 0;
    const payAmount = receiveAmount / exchangeRate;
    if(payAmount > 0){
    setYouPayAmount(payAmount ? payAmount.toFixed(2) : '0.00');
    }
  }
}, [youPayAmount, youReceiveAmount, exchangeRate, conversionDirection]);


  

  // const navigate = useNavigate();

  // useEffect(() => {
  //   const initSession = async () => {
  //     const { data, error } = await supabase.auth.getSession();

  //     if (error) {
  //       console.error('Error getting session:', error);
  //       navigate('/login');
  //       return;
  //     }

  //     const session = data.session;

  //     if (!session) {
  //       navigate('/login');
  //       return;
  //     }

  //     setUser(session.user);
  //     setLoading(false);
  //   };

  //   initSession();

  //   // Listen for auth changes (login/logout)
  //   const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
  //     if (!session) {
  //       navigate('/login');
  //     } else {
  //       setUser(session.user);
  //     }
  //   });

  //   return () => {
  //     listener.subscription.unsubscribe();
  //   };
  // }, [navigate]);

  // const handleLogout = async () => {
  //   await supabase.auth.signOut();
  //   navigate('/login');
  // };

  const paymentMethods = [
    { id: 'telebirr', name: 'Telebirr', icon: Telebirr},
    
  ];

  const selectedMethod = paymentMethods.find((m) => m.name === selectedPaymentMethod);

  const handlePaymentMethodSelect = (method: any) => {
    setSelectedPaymentMethod(method.name);
    setShowPaymentMethods(false);
  };

  

  const handleSellCrypto = () => {
    if (!selectedPaymentMethod || !recipientPhone || !youPayAmount || parseFloat(youPayAmount) <= 0) {
      return;
    }

    const data = {
      amount: youPayAmount,
      token: selectedToken,
      receiveAmount: youReceiveAmount,
      currency: selectedCurrency,
      paymentMethod: selectedPaymentMethod,
      recipientPhone: recipientPhone
    };
    setTransactionData(data);
    setShowConfirmModal(true);
  };


  
   const RECIPIENT_ADDRESS = import.meta.env.VITE_RECIPIENT_ADDRESS

  const handleConfirmTransaction = async () => {
  try {
  

    if (!youPayAmount || isNaN(Number(youPayAmount))) {
      alert("Please enter a valid amount")
      return
    }

    if (!RECIPIENT_ADDRESS) {
      alert("Recipient address is missing")
      return
    }

    const hash = await writeContractAsync({
      chainId: base.id,
      address: USDC_CONTRACT_ADDRESS,
      abi: erc20Abi,
      functionName: "transfer",
      args: [RECIPIENT_ADDRESS, parseUnits(youPayAmount, 6)],
    })

    console.log("Transaction hash:", hash)
    setTransactionHash(hash)
  } catch (err) {
    console.error("Transaction error:", err)
    // alert(`Transaction error: ${(err as Error).message}`)
  }
}

  useEffect(() => {
    if (hash) {
      console.log("Transaction hash received:", hash)
      setTransactionHash(hash)
    }
  }, [hash])

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
  } = useWaitForTransactionReceipt({
    hash: transactionHash as `0x${string}`,
  })

  

  useEffect(() => {
    if (isConfirmed && transactionHash) {
      console.log("Transaction confirmed, calling submitPayment")
      // Call backend once
      submitPayment({
        transaction_hash: transactionHash,
        amount: Number.parseFloat(youReceiveAmount),
        chain: "BASE",
        shortcode: recipientPhone,
        mobile_network:selectedPaymentMethod ,
      })

      // Show success modal
      setShowConfirmModal(false)
      setShowTransactionModal(true)
    }
  }, [isConfirmed, transactionHash])

  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
       {/* Header */}
       <header className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4">
         <div className="flex items-center">
           <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg overflow-hidden">
             <img src={SemuniLogo} alt="SemuniPay Logo" className="w-full h-full object-contain" />
           </div>
           <div className="text-lime-400 font-bold text-xl sm:text-2xl tracking-wide ml-2 sm:ml-3">SemuniPay</div>
         </div>
         
         <div className="flex items-center">
           <BasenameConnectButton/>
         </div>
       </header>

       {/* Off-ramp Disabled Banner */}
       {OFF_RAMP_DISABLED && !bannerDismissed && (
         <div className="max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 mt-4 mb-2">
           <div className="bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm rounded-xl p-4 flex items-start justify-between gap-4">
             <div className="flex-1">
               <div className="flex items-center gap-2 mb-1">
                 <Clock className="text-amber-400" size={18} />
                 <h3 className="text-amber-300 font-semibold text-sm sm:text-base">Off-ramp Temporarily Unavailable</h3>
               </div>
               <p className="text-amber-200/80 text-xs sm:text-sm">
                 We're currently making improvements to our off-ramp service. For updates, reach us on{' '}
                 <a 
                   href="https://twitter.com/semunipay" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-amber-300 hover:text-amber-200 underline"
                 >
                   X
                 </a>
                 .
               </p>
             </div>
             <button
               onClick={() => setBannerDismissed(true)}
               className="text-amber-300 hover:text-amber-200 transition-colors flex-shrink-0"
               aria-label="Dismiss banner"
             >
               <X size={18} />
             </button>
           </div>
         </div>
       )}

       {/* Main Content */}
       <div className="max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 py-2">
         <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-700/30 shadow-2xl">
          
          {/* You Pay Section */}
          {/* <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              YOU PAY
            </label>
            <div className="bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30">
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  value={youPayAmount}
                  onChange={(e) => setYouPayAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-4xl font-bold text-white placeholder-gray-500 focus:outline-none flex-1 mr-3"
                />
                <div className="flex items-center bg-gray-600/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-500/30">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-bold">$</span>
                  </div>
                  <span className="font-semibold text-white">{selectedToken}</span>
                  <ChevronDown size={16} className="ml-2 text-gray-400" />
                </div>
              </div>
            </div>
          </div> */}
          
           {/* You Pay Section */}
           <div className="mb-3 sm:mb-4">
             <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2 sm:mb-3 uppercase tracking-wider">
               YOU PAY
             </label>
             <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30">
               <div className="flex items-center justify-between">
                 <div className="flex-1 mr-3 sm:mr-4">
                   <input
                     type="number"
                     value={youPayAmount}
                     onChange={(e) =>{
                        setConversionDirection('pay');
                       setYouPayAmount(e.target.value);
                     }}
                     placeholder="0.00"
                     disabled={OFF_RAMP_DISABLED}
                     className="w-full bg-transparent text-lg sm:text-xl text-white placeholder-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                   />
                 </div>
                 <div className="flex items-center bg-gray-600/50 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 border border-gray-500/30">
                   <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-2 overflow-hidden">
                     <img src={USDC} alt="USDC" className="w-full h-full object-cover" />
                   </div>
                   <span className="font-semibold text-white text-sm sm:text-base">{selectedToken}</span>
                   <ChevronDown size={14} className="ml-1 sm:ml-2 text-gray-400" />
                 </div>
               </div>
             </div>
           </div>

           {/* Exchange Rate */}
           <div className="flex items-center justify-center mb-3 sm:mb-4">
             <div className="flex items-center bg-gray-700/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-600/20">
               <RefreshCw size={14} className="text-lime-400 mr-1.5 sm:mr-2" />
               <span className="text-xs sm:text-sm text-gray-300">1 USD = {exchangeRate} ETB</span>
             </div>
           </div>

           {/* You Receive Section */}
           <div className="mb-3 sm:mb-4">
             <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2 sm:mb-3 uppercase tracking-wider">
               YOU RECEIVE
             </label>
             <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30">
               <div className="flex items-center justify-between">
                 <div className="flex-1 mr-3 sm:mr-4">
                   <input
                     type="text"
                     value={youReceiveAmount}
                     onChange={(e) => {
                       setConversionDirection('receive');
                       setYouReceiveAmount(e.target.value);
                     }
                   }
                   placeholder="0.00"
                     disabled={OFF_RAMP_DISABLED}
                     className="w-full bg-transparent text-lg sm:text-xl text-white placeholder-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                   />
                 </div>
                 <div className="flex items-center bg-gray-600/50 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 border border-gray-500/30">
                   <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-2 overflow-hidden">
                     <img src={ETB} alt="ETB" className="w-full h-full object-cover" />
                   </div>
                   <span className="font-semibold text-white text-sm sm:text-base">{selectedCurrency}</span>
                   <ChevronDown size={14} className="ml-1 sm:ml-2 text-gray-400" />
                 </div>
               </div>
             </div>
           </div>

           {/* Payment Method Selection */}
           <div className="mb-3 sm:mb-4">
             <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2 sm:mb-3 uppercase tracking-wider">
               CHOOSE YOUR PAYMENT METHOD
             </label>
             <div className="relative">
               <button
                 onClick={() => setShowPaymentMethods(!showPaymentMethods)}
                 disabled={OFF_RAMP_DISABLED}
                 className="w-full bg-gray-700/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30 flex items-center justify-between hover:bg-gray-700/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700/30"
               >
                 <div className="flex items-center">
                   {selectedPaymentMethod ? (
                     <>
                       <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-600/50 rounded-full flex items-center justify-center mr-3 sm:mr-4 overflow-hidden">
                         {selectedMethod && typeof selectedMethod.icon === 'string' && selectedMethod.icon.endsWith('.png') ? (
                           <img src={selectedMethod.icon as any} alt={selectedPaymentMethod} className="w-full h-full object-cover" />
                         ) : (
                           <span className="text-lg sm:text-2xl">{selectedMethod && typeof selectedMethod.icon === 'string' && !selectedMethod.icon.endsWith('.png') ? selectedMethod.icon : '🏦'}</span>
                         )}
                       </div>
                       <div>
                         <div className="text-white font-semibold text-left text-sm sm:text-base">{selectedPaymentMethod}</div>
                         <div className="text-gray-400 text-xs sm:text-sm">Selected to use</div>
                       </div>
                     </>
                   ) : (
                     <div className="text-gray-400 text-sm sm:text-base">Select payment method</div>
                   )}
                 </div>
                 <ChevronDown size={18} className="text-gray-400" />
               </button>

               {/* Payment Methods Dropdown */}
               {showPaymentMethods && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/90 backdrop-blur-md rounded-xl sm:rounded-2xl border border-gray-700/50 shadow-2xl z-10 overflow-hidden">
                   {paymentMethods.map((method) => (
                     <button
                       key={method.id}
                       onClick={() => handlePaymentMethodSelect(method)}
                       className="w-full p-3 sm:p-4 flex items-center hover:bg-gray-700/50 transition-all duration-300 border-b border-gray-700/30 last:border-b-0"
                     >
                       <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600/50 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                         {typeof method.icon === 'string' && (method.icon.endsWith('.png') || method.icon.endsWith('.jpg') || method.icon.endsWith('.jpeg') || method.icon.endsWith('.svg')) ? (
                           <img src={method.icon} alt={method.name} className="w-full h-full object-cover" />
                         ) : (
                           <span className="text-sm sm:text-lg">{typeof method.icon === 'string' ? method.icon : '🏦'}</span>
                         )}
                       </div>
                       <span className="text-white font-medium text-sm sm:text-base">{method.name}</span>
                     </button>
                   ))}
                 </div>
               )}
             </div>
           </div>

           {/* Recipient Phone Number */}
           {selectedPaymentMethod && (
             <div className="mb-6 sm:mb-8">
               <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2 sm:mb-3 uppercase tracking-wider">
                 RECIPIENT PHONE NUMBER
               </label>
               <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-600/30">
                 <input
                   type="tel"
                   value={recipientPhone}
                   onChange={(e) => setRecipientPhone(e.target.value)}
                   placeholder="+251 91 234 5678"
                   disabled={OFF_RAMP_DISABLED}
                   className="w-full bg-transparent text-lg sm:text-xl text-white placeholder-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                 />
               </div>
             </div>
           )}

          {/* Fee Quote */}
          <div className="mb-4">
            <div className="bg-gray-700/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/20">
              <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
                TOTAL FEE QUOTE
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-300">Processing fees</span>
                    <Info size={14} className="ml-2 text-gray-500" />
                  </div>
                  <span className="text-white font-medium">
                   0.0 ETB
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-300">Estimated Onchain fees</span>
                    <Info size={14} className="ml-2 text-gray-500" />
                  </div>
                  <span className="text-white font-medium">0.00 ETB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sell Button */}
          {OFF_RAMP_DISABLED ? (
            <div className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-4 text-center">
              <p className="text-gray-400 text-sm sm:text-base">
                Off-ramp service is temporarily unavailable. We're making improvements and will be back soon.
              </p>
              <a
                href="https://twitter.com/semunipay"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-lime-400 hover:text-lime-300 text-sm font-semibold transition-colors"
              >
                Follow us on X for updates
              </a>
            </div>
          ) : (
            <button
              onClick={handleSellCrypto}
              disabled={ !selectedPaymentMethod || !recipientPhone || !youPayAmount || parseFloat(youPayAmount) <= 0}
              className="w-full bg-lime-400 text-gray-900 font-bold py-4 rounded-2xl hover:bg-lime-300 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* {isTransacting ? 'Processing...' : 'Sell Crypto'} */}
              Send ETB
            </button>
          )}
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
              <h3 className="text-2xl font-bold text-white mb-2">Confirm Transaction</h3>
              <p className="text-gray-400">Please review your transaction details</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">You Pay:</span>
                  <span className="text-white">{transactionData?.amount} {transactionData?.token}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">You Receive:</span>
                  <span className="text-white">{transactionData?.receiveAmount} {transactionData?.currency}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="text-white">{transactionData?.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Recipient:</span>
                  <span className="text-white">{transactionData?.recipientPhone}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isTransactionPending}
                className="flex-1 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-white py-3 rounded-lg hover:bg-gray-700/70 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTransaction}
                className="flex-1 bg-lime-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-lime-300 transition-all duration-300"
                disabled={isTransactionPending}
              >
                {isTransactionPending ? 'Processing...' : 'Confirm'}
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
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-lime-400/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-lime-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
              <p className="text-gray-400 mb-4">
                Your USDC has been sent and ETB will be delivered to {recipientPhone}
              </p>
              
              {/* Transaction Details */}
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4 mb-4 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount Sent:</span>
                    <span className="text-white font-medium">{youPayAmount} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount Received:</span>
                    <span className="text-white font-medium">{youReceiveAmount} ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Method:</span>
                    <span className="text-white font-medium">{selectedPaymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recipient:</span>
                    <span className="text-white font-medium">{recipientPhone}</span>
                  </div>
                </div>
              </div>

              {transactionHash && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Transaction Details:</p>
                  <a
                    href={`https://basescan.org/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 py-2 px-3 rounded-lg transition-all duration-300 text-xs font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    View on BaseScan
                  </a>
                  <p className="text-xs text-gray-500 mt-2 break-all">
                    {transactionHash}
                  </p>
                </div>
              )}
              
              <button
                onClick={() => {
                  setShowTransactionModal(false);
                  // Reset form for next transaction
                  setYouPayAmount('0.00');
                  setYouReceiveAmount('0.00');
                  setSelectedPaymentMethod('');
                  setRecipientPhone('');
                  setTransactionHash('');
                }}
                className="w-full bg-lime-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-lime-300 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Make Another Payment
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default Dashboard;