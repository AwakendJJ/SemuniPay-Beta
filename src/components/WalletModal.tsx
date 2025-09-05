import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useWallet, WalletType } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { connectWallet, isConnecting, error, account } = useWallet();
  const navigate = useNavigate();

  const handleConnect = async (walletType: WalletType) => {
    await connectWallet(walletType);
    // We don't immediately navigate here because we need to wait for the account to be set
  };

  // Add effect to navigate and close modal when account changes
  useEffect(() => {
    if (account) {
      navigate('/dashboard');
      onClose();
    }
  }, [account, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md relative border border-gray-700 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white">Connect Wallet</h3>
          <p className="text-gray-400 mt-2">Connect your wallet to access AddisPay features</p>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}
        
        <div className="space-y-3">
          {/* MetaMask */}
          <button
            onClick={() => handleConnect('metamask')}
            disabled={isConnecting}
            className={`flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 rounded-xl p-4 transition-colors ${
              isConnecting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask" 
                className="w-8 h-8 mr-3"
              />
              <div className="text-left">
                <div className="font-semibold">MetaMask</div>
                <div className="text-xs text-gray-400">Connect using browser wallet</div>
              </div>
            </div>
            {isConnecting && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </button>
          
          {/* Phantom */}
          <button
            onClick={() => handleConnect('phantom')}
            disabled={isConnecting}
            className={`flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 rounded-xl p-4 transition-colors ${
              isConnecting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center">
              <img 
                src="https://phantom.app/img/phantom-logo.svg" 
                alt="Phantom" 
                className="w-8 h-8 mr-3"
              />
              <div className="text-left">
                <div className="font-semibold">Phantom</div>
                <div className="text-xs text-gray-400">Connect using Solana wallet</div>
              </div>
            </div>
            {isConnecting && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </button>
          
          {/* Coinbase Wallet */}
          <button
            onClick={() => handleConnect('coinbase')}
            disabled={isConnecting}
            className={`flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 rounded-xl p-4 transition-colors ${
              isConnecting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center">
              <img 
                src="https://www.coinbase.com/assets/press/coinbase-mark-1a56e27c55.svg" 
                alt="Coinbase Wallet" 
                className="w-8 h-8 mr-3"
              />
              <div className="text-left">
                <div className="font-semibold">Coinbase Wallet</div>
                <div className="text-xs text-gray-400">Connect using Coinbase Wallet</div>
              </div>
            </div>
            {isConnecting && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </button>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-4">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default WalletModal;