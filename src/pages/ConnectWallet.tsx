import React, { useEffect } from 'react';
// import { useWallet, WalletType } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAccount, useConnect } from "wagmi"

const ConnectWallet: React.FC = () => {
 
  const navigate = useNavigate();
  const { address } = useAccount()
  const { connectors, connect } = useConnect()
  
  
  useEffect(() => {
    if (address) {
      navigate('/dashboard');
    }
  }, [address, navigate]);


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </button>

        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-lime-400 rounded-full filter blur-[80px] opacity-10"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-lime-400 rounded-full filter blur-[80px] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-gray-900 font-bold text-xl">S</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Connect to SemuniPay</h2>
              <p className="text-gray-400">Connect your wallet to access the SemuniPay platform</p>
            </div>
{/*             
            {error && (
              <div className="bg-red-900/30 border border-red-500 text-red-200 rounded-lg p-3 mb-6">
                {error}
              </div>
            )} */}
            
            <div className="space-y-3">
              {/* MetaMask */}
              
              {/* <button
                onClick={() => handleConnect('metamask')}
                disabled={isConnecting}
                className={`flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 rounded-xl p-4 transition-colors ${
                  isConnecting && selectedWallet === 'metamask' ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              > */}

         {
        connectors.map(connector => (
          <button key={connector.uid} onClick={() => connect({ connector })}>
            <div className="flex items-center">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                    alt="MetaMask" 
                    className="w-8 h-8 mr-3"
                  />
                  <div className="text-left">
                    <div className="font-semibold">{connector.name}</div>
                    <div className="text-xs text-gray-400">Connect using browser {connector.name}</div>
                  </div>
                </div>
          </button>
        ))
      }

      
               
              
              {/* Phantom
              <button
                onClick={() => handleConnect('phantom')}
                disabled={isConnecting}
                className={`flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 rounded-xl p-4 transition-colors ${
                  isConnecting && selectedWallet === 'phantom' ? 'opacity-70 cursor-not-allowed' : ''
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
                {isConnecting && selectedWallet === 'phantom' && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </button>
              
              {/* Coinbase Wallet */}
              {/* <button
                onClick={() => handleConnect('coinbase')}
                disabled={isConnecting}
                className={`flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 rounded-xl p-4 transition-colors ${
                  isConnecting && selectedWallet === 'coinbase' ? 'opacity-70 cursor-not-allowed' : ''
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
                {isConnecting && selectedWallet === 'coinbase' && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </button> */} 

            </div>
            
            <div className="text-center text-xs text-gray-500 mt-4">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;