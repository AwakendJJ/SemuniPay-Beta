import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// USDC Contract Address on Base Network
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// USDC Contract ABI (minimal for transfer function)
const USDC_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)'
];

// Base Network Configuration
const BASE_NETWORK = {
  chainId: '0x2105', // 8453 in hex
  chainName: 'Base',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org'],
};

// Define wallet types
export type WalletType = 'metamask' | 'phantom' | 'coinbase' | null;

interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

interface WalletContextType {
  account: string | null;
  walletType: WalletType;
  connectWallet: (type: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  error: string | null;
  sendUSDC: (amount: string) => Promise<TransactionResult>;
  getUSDCBalance: () => Promise<string>;
  isTransacting: boolean;
  switchToBase: () => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  walletType: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
  error: null,
  sendUSDC: async () => ({ success: false }),
  getUSDCBalance: async () => '0',
  isTransacting: false,
  switchToBase: async () => false,
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTransacting, setIsTransacting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProvider = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.providers.Web3Provider(window.ethereum);
    }
    return null;
  };

  const switchToBase = async (): Promise<boolean> => {
    if (!window.ethereum) return false;
    
    try {
      // Try to switch to Base network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_NETWORK.chainId }],
      });
      return true;
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_NETWORK],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add Base network:', addError);
          return false;
        }
      }
      console.error('Failed to switch to Base network:', switchError);
      return false;
    }
  };

  const sendUSDC = async (amount: string): Promise<TransactionResult> => {
    if (!account || walletType !== 'metamask') {
      return { success: false, error: 'Wallet not connected or unsupported wallet type' };
    }

    const provider = getProvider();
    if (!provider) {
      return { success: false, error: 'Provider not available' };
    }

    setIsTransacting(true);
    setError(null);

    try {
      // Switch to Base network first
      const switched = await switchToBase();
      if (!switched) {
        throw new Error('Failed to switch to Base network');
      }

      // Get fresh provider and signer after network switch
      const freshProvider = getProvider();
      if (!freshProvider) {
        throw new Error('Provider not available after network switch');
      }

      const signer = freshProvider.getSigner();
      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, signer);
      
      // Get recipient address from environment variable
      const recipientAddress = import.meta.env.VITE_RECIPIENT_WALLET;
      if (!recipientAddress) {
        throw new Error('Recipient wallet address not configured');
      }

      // Convert amount to USDC decimals (6 decimals)
      const amountInWei = ethers.utils.parseUnits(amount, 6);
      
      // Check balance first
      const balance = await usdcContract.balanceOf(account);
      if (balance.lt(amountInWei)) {
        throw new Error('Insufficient USDC balance');
      }

      // Send transaction
      const tx = await usdcContract.transfer(recipientAddress, amountInWei);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.transactionHash
      };
    } catch (err: any) {
      console.error('USDC transaction failed:', err);
      const errorMessage = err.reason || err.message || 'Transaction failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsTransacting(false);
    }
  };

  const getUSDCBalance = async (): Promise<string> => {
    if (!account || walletType !== 'metamask') {
      return '0';
    }

    try {
      // Switch to Base network first
      const switched = await switchToBase();
      if (!switched) {
        console.error('Failed to switch to Base network for balance check');
        return '0';
      }

      // Get fresh provider after network switch
      const provider = getProvider();
      if (!provider) {
        return '0';
      }

      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, provider);
      const balance = await usdcContract.balanceOf(account);
      return ethers.utils.formatUnits(balance, 6);
    } catch (err) {
      console.error('Failed to get USDC balance:', err);
      return '0';
    }
  };

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
        sendUSDC,
        getUSDCBalance,
        isTransacting,
        switchToBase,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};