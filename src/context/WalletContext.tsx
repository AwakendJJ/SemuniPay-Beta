import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import MetaMaskSDK from '@metamask/sdk';

// Define wallet types
export type WalletType = 'metamask' | 'phantom' | 'coinbase' | null;

interface WalletContextType {
  account: string | null;
  walletType: WalletType;
  connectWallet: (type: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  walletType: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
  error: null,
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

let MMSDK: MetaMaskSDK | null = null;

if (typeof window !== 'undefined') {
  MMSDK = new MetaMaskSDK({
    dappMetadata: { name: "SemuniPay", url: window.location.href }
  });
}

 // You can also access via window.ethereum

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async (type: WalletType) => {
    if (!type) return;
    
    setIsConnecting(true);
    setError(null);
    setWalletType(type);

    try {
      if (type === 'metamask') {
        await connectMetaMask();
      } else if (type === 'phantom') {
        await connectPhantom();
      } else if (type === 'coinbase') {
        await connectCoinbase();
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      setWalletType(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectMetaMask = async () => {
    if (MMSDK) {
      const ethereum = MMSDK.getProvider();
      if (ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts', params: [] });
        if (accounts && Array.isArray(accounts) && accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } else {
        throw new Error('MetaMask provider not available. Please install MetaMask.');
      }
    }
  };

  const connectPhantom = async () => {
    if (typeof window !== 'undefined' && window.solana) {
      try {
        const resp = await window.solana.connect();
        const publicKey = resp.publicKey.toString();
        setAccount(publicKey);
      } catch (err) {
        console.error('Error connecting to Phantom:', err);
        throw new Error(err instanceof Error ? err.message : 'Failed to connect to Phantom');
      }
    } else {
      throw new Error('Phantom is not installed. Please install Phantom to connect your wallet.');
    }
  };

  const connectCoinbase = async () => {
    try {
      // Check if Coinbase Wallet extension is installed
      if (typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          throw new Error('No accounts found.');
        }
      } else {
        throw new Error('Coinbase Wallet is not installed. Please install Coinbase Wallet to connect.');
      }
    } catch (err) {
      console.error('Error connecting to Coinbase Wallet:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to connect to Coinbase Wallet');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setWalletType(null);
  };

  // Handle account changes for different wallet types
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
      }
    };

    const handlePhantomAccountChange = () => {
      if (window.solana?.publicKey) {
        setAccount(window.solana.publicKey.toString());
      } else {
        setAccount(null);
      }
    };

    if (typeof window !== 'undefined') {
      // MetaMask event listeners
      if (MMSDK?.getProvider() && walletType === 'metamask') {
        if (window.ethereum) {
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('disconnect', disconnectWallet);
        }
      }

      // Phantom event listeners
      if (window.solana && walletType === 'phantom') {
        if (window.solana) {
          window.solana.on('accountChanged', handlePhantomAccountChange);
          window.solana.on('disconnect', disconnectWallet);
        }
      }

      // Coinbase Wallet event listeners
      if (window.ethereum?.isCoinbaseWallet && walletType === 'coinbase') {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('disconnect', disconnectWallet);
      }

      return () => {
        if (window.ethereum && MMSDK?.getProvider() && (walletType === 'metamask' || walletType === 'coinbase')) {
          if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('disconnect', disconnectWallet);
          }
        }

        if (window.solana && walletType === 'phantom') {
          if (window.solana) {
            window.solana.removeListener('accountChanged', handlePhantomAccountChange);
            window.solana.removeListener('disconnect', disconnectWallet);
          }
        }
      };
    }
  }, [walletType]);

  return (
    <WalletContext.Provider
      value={{
        account,
        walletType,
        connectWallet,
        disconnectWallet,
        isConnecting,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};