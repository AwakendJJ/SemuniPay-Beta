import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Info, Check, ArrowLeft, CreditCard, Send, X, Clock, RefreshCw, ChevronUp } from 'lucide-react';
import USDC from '../Images/USDC.png';
import ETB from '../Images/ETB.jpeg';
import Telebirr from '../Images/Telebirr.png';

const Dashboard: React.FC = () => {
  const { account, disconnectWallet, sendUSDC, getUSDCBalance, isTransacting, switchToBase } = useWallet();
  const navigate = useNavigate();
  
  // State for form fields
  const [youPayAmount, setYouPayAmount] = useState('0.00');
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [youReceiveAmount, setYouReceiveAmount] = useState('0.00');
  const [selectedCurrency, setSelectedCurrency] = useState('ETB');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState('');
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState('0');
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionData, setTransactionData] = useState<any>(null);

  // Exchange rate (mock for now)
  const exchangeRate = 148.50; // 1 USD = 148.50 ETB

  // Load USDC balance when account changes
  useEffect(() => {
    if (account) {
      loadUSDCBalance();
    }
  }, [account]);

  // Update receive amount when pay amount changes
  useEffect(() => {
    const payAmount = parseFloat(youPayAmount) || 0;
    const receiveAmount = payAmount * exchangeRate;
    setYouReceiveAmount(receiveAmount.toFixed(2));
  }, [youPayAmount, exchangeRate]);

  const loadUSDCBalance = async () => {
    try {
      const balance = await getUSDCBalance();
      setUsdcBalance(balance);
    } catch (error) {
      console.error('Failed to load USDC balance:', error);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    navigate('/connect');
  };

  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const paymentMethods = [
    { id: 'telebirr', name: 'Telebirr', icon: Telebirr },
    { id: 'cbe-birr', name: 'CBE Birr', icon: '🏦' }
    
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

  const handleConfirmTransaction = async () => {
    setShowConfirmModal(false);
    
    try {
      const result = await sendUSDC(transactionData.amount);
      if (result.success) {
        setTransactionHash(result.txHash || '');
        setShowTransactionModal(true);
        setTimeout(() => {
          loadUSDCBalance();
        }, 2000);
      }
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-gray-800/50">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <span className="text-gray-900 font-bold text-xl">S</span>
          </div>
          <div className="text-lime-400 font-bold text-3xl tracking-wide">SemuniPay</div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Mode Toggle */}
          {/* <div className="bg-gray-800/50 backdrop-blur-md rounded-full p-1 border border-gray-700/50">
            <button className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium transition-all duration-300">
              SELL
            </button>
          </div> */}
          
          {account ? (
            <>
              <div className="bg-gray-800/30 backdrop-blur-sm text-lime-400 font-medium px-4 py-2 rounded-full border border-gray-700/50">
                {formatWalletAddress(account)}
              </div>
              <button 
                onClick={handleDisconnect}
                className="bg-red-500/20 border border-red-500/30 text-red-400 font-medium px-4 py-2 rounded-full hover:bg-red-500/30 transition-all duration-300"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button 
              className="bg-lime-400 text-gray-900 font-semibold px-6 py-2 rounded-full hover:bg-lime-300 transition-all duration-300"
              onClick={() => navigate('/connect')}
            >
              Connect
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-gray-800/30 backdrop-blur-md rounded-3xl p-8 border border-gray-700/30 shadow-2xl">
          
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
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              YOU PAY
            </label>
            <div className="bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <input
                    type="number"
                    value={youPayAmount}
                    onChange={(e) => setYouPayAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-xl text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center bg-gray-600/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-500/30">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 overflow-hidden">
                    <img src={USDC} alt="USDC" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-semibold text-white">{selectedToken}</span>
                  <ChevronDown size={16} className="ml-2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Exchange Rate */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center bg-gray-700/20 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-600/20">
              <RefreshCw size={16} className="text-lime-400 mr-2" />
              <span className="text-sm text-gray-300">1 USD = {exchangeRate} ETB</span>
            </div>
          </div>

          {/* You Receive Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              YOU RECEIVE
            </label>
            <div className="bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <input
                    type="text"
                    value={youReceiveAmount}
                    readOnly
                    className="w-full bg-transparent text-xl text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center bg-gray-600/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-500/30">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 overflow-hidden">
                    <img src={ETB} alt="ETB" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-semibold text-white">{selectedCurrency}</span>
                  <ChevronDown size={16} className="ml-2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              CHOOSE YOUR PAYMENT METHOD
            </label>
            <div className="relative">
              <button
                onClick={() => setShowPaymentMethods(!showPaymentMethods)}
                className="w-full bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30 flex items-center justify-between hover:bg-gray-700/40 transition-all duration-300"
              >
                <div className="flex items-center">
                  {selectedPaymentMethod ? (
                    <>
                      <div className="w-10 h-10 bg-gray-600/50 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                        {selectedMethod && typeof selectedMethod.icon === 'string' && selectedMethod.icon.endsWith('.png') ? (
                          <img src={selectedMethod.icon as any} alt={selectedPaymentMethod} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">{selectedMethod && typeof selectedMethod.icon === 'string' && !selectedMethod.icon.endsWith('.png') ? selectedMethod.icon : '🏦'}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-left">{selectedPaymentMethod}</div>
                        <div className="text-gray-400 text-sm">Selected to use</div>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">Select payment method</div>
                  )}
                </div>
                <ChevronDown size={20} className="text-gray-400" />
              </button>

              {/* Payment Methods Dropdown */}
              {showPaymentMethods && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/90 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl z-10 overflow-hidden">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method)}
                      className="w-full p-4 flex items-center hover:bg-gray-700/50 transition-all duration-300 border-b border-gray-700/30 last:border-b-0"
                    >
                      <div className="w-8 h-8 bg-gray-600/50 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                        {typeof method.icon === 'string' && (method.icon.endsWith('.png') || method.icon.endsWith('.jpg') || method.icon.endsWith('.jpeg') || method.icon.endsWith('.svg')) ? (
                          <img src={method.icon} alt={method.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg">{typeof method.icon === 'string' ? method.icon : '🏦'}</span>
                        )}
                      </div>
                      <span className="text-white font-medium">{method.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recipient Phone Number */}
          {selectedPaymentMethod && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                RECIPIENT PHONE NUMBER
              </label>
              <div className="bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30">
                <input
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="+251 91 234 5678"
                  className="w-full bg-transparent text-xl text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Fee Quote */}
          <div className="mb-8">
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
                    {(parseFloat(youReceiveAmount) * 0.02).toFixed(2)} ETB
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
          <button
            onClick={handleSellCrypto}
            disabled={isTransacting || !selectedPaymentMethod || !recipientPhone || !youPayAmount || parseFloat(youPayAmount) <= 0}
            className="w-full bg-lime-400 text-gray-900 font-bold py-4 rounded-2xl hover:bg-lime-300 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isTransacting ? 'Processing...' : 'Sell Crypto'}
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
                disabled={isTransacting}
                className="flex-1 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-white py-3 rounded-lg hover:bg-gray-700/70 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTransaction}
                className="flex-1 bg-lime-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-lime-300 transition-all duration-300"
                disabled={isTransacting}
              >
                {isTransacting ? 'Processing...' : 'Confirm'}
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
              <p className="text-gray-400 mb-4">
                Your crypto sale has been submitted to the Base network.
              </p>
              {transactionHash && (
                <p className="text-xs text-gray-500 mb-6 break-all">
                  TX: {transactionHash}
                </p>
              )}
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
  );
};

export default Dashboard;