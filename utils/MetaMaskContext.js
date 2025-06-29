import React, { createContext, useContext, useState, useEffect } from 'react';

const MetaMaskContext = createContext();

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);
  if (!context) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider');
  }
  return context;
};

export const MetaMaskProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return isClient && typeof window !== "undefined" && window.ethereum && window.ethereum.isMetaMask;
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to use this app.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Dynamically import ethers to avoid SSR issues
      const { ethers } = await import('ethers');
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = web3Provider.getSigner();
        
        setAccount(accounts[0]);
        setProvider(web3Provider);
        setSigner(signer);
      }
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
      setError('Failed to connect to MetaMask. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setError(null);
  };

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has no accounts
      disconnectWallet();
    } else if (accounts[0] !== account) {
      // Account changed
      setAccount(accounts[0]);
    }
  };

  // Handle chain changes
  const handleChainChanged = () => {
    // Reload the page when chain changes
    if (isClient) {
      window.location.reload();
    }
  };

  // Switch to Sepolia network
  const switchToSepolia = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia',
                nativeCurrency: {
                  name: 'Sepolia Ether',
                  symbol: 'SEP',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/313d61c497b74eaeac16e57f2cb20b72'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          setError('Failed to add Sepolia network to MetaMask');
        }
      } else {
        setError('Failed to switch to Sepolia network');
      }
    }
  };

  // Get current network
  const getCurrentNetwork = async () => {
    if (!provider) return null;
    try {
      const network = await provider.getNetwork();
      return network;
    } catch (err) {
      console.error('Error getting network:', err);
      return null;
    }
  };

  // Get ETH balance
  const getEthBalance = async (address) => {
    if (!provider || !address) return '0';
    try {
      const { ethers } = await import('ethers');
      const balance = await provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (err) {
      console.error('Error getting ETH balance:', err);
      return '0';
    }
  };

  // Setup event listeners
  useEffect(() => {
    if (isClient && typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          if (accounts.length > 0) {
            const { ethers } = await import('ethers');
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = web3Provider.getSigner();
            
            setAccount(accounts[0]);
            setProvider(web3Provider);
            setSigner(signer);
          }
        } catch (err) {
          console.error('Error checking connection:', err);
        }
      };

      checkConnection();

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [isClient]);

  const value = {
    account,
    provider,
    signer,
    isConnecting,
    error,
    isClient,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    getCurrentNetwork,
    getEthBalance,
  };

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  );
}; 