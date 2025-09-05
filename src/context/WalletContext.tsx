import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

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
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          throw new Error('No accounts found.');
        }
      } catch (err) {
        console.error('Error connecting to MetaMask:', err);
        throw new Error(err instanceof Error ? err.message : 'Failed to connect to MetaMask');
      }
    } else {
      throw new Error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
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
      if (window.ethereum && walletType === 'metamask') {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('disconnect', disconnectWallet);
      }

      // Phantom event listeners
      if (window.solana && walletType === 'phantom') {
        window.solana.on('accountChanged', handlePhantomAccountChange);
        window.solana.on('disconnect', disconnectWallet);
      }

      // Coinbase Wallet event listeners
      if (window.ethereum?.isCoinbaseWallet && walletType === 'coinbase') {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('disconnect', disconnectWallet);
      }

      return () => {
        if (window.ethereum && (walletType === 'metamask' || walletType === 'coinbase')) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('disconnect', disconnectWallet);
        }

        if (window.solana && walletType === 'phantom') {
          window.solana.removeListener('accountChanged', handlePhantomAccountChange);
          window.solana.removeListener('disconnect', disconnectWallet);
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