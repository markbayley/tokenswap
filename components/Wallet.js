import React, { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { getTokenBalance, getTokenAddress } from "../utils/context";
import { ETH, USDT, USDC } from "../utils/saleToken";
import { toEth } from "../utils/utils";
import LoadingSpinner from "./LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

const Wallet = () => {
  const [balances, setBalances] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("balances");

  const { address } = useAccount();

  // Toast notifications
  const notifyError = useCallback((msg) => toast.error(msg, { duration: 5000 }), []);
  const notifySuccess = useCallback((msg) => toast.success(msg, { duration: 5000 }), []);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch all token balances
  const fetchBalances = useCallback(async () => {
    if (!isClient || !address) return;

    setIsLoading(true);
    try {
      const newBalances = {};
      
      // Fetch ETH balance
      if (window.ethereum) {
        const provider = new (await import("ethers")).providers.Web3Provider(window.ethereum);
        const ethBalance = await provider.getBalance(address);
        newBalances[ETH] = toEth(ethBalance, 18);
      }

      // Fetch token balances
      const tokens = [USDT, USDC];
      for (const token of tokens) {
        try {
          const balance = await getTokenBalance(token, address);
          newBalances[token] = toEth(balance, 18);
        } catch (error) {
          console.error(`Error fetching ${token} balance:`, error);
          newBalances[token] = "0";
        }
      }

      setBalances(newBalances);
      notifySuccess("Balances updated successfully");
    } catch (error) {
      console.error("Error fetching balances:", error);
      notifyError("Failed to fetch balances");
    } finally {
      setIsLoading(false);
    }
  }, [address, notifyError, notifySuccess]);

  // Fetch balances on mount and when address changes
  useEffect(() => {
    if (isMounted && address) {
      fetchBalances();
    }
  }, [isMounted, address, fetchBalances]);

  // Copy address to clipboard
  const copyAddress = useCallback(() => {
    if (address && isClient) {
      navigator.clipboard.writeText(address);
      notifySuccess("Address copied to clipboard");
    }
  }, [address, notifySuccess]);

  // Format address for display
  const formatAddress = useCallback((addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  // Calculate total portfolio value (simplified - using current prices)
  const calculateTotalValue = useCallback(() => {
    if (!balances[ETH]) return 0;
    
    // Assuming 1 ETH = $2460, 1 USDT = $1, 1 USDC = $1
    const ethValue = parseFloat(balances[ETH] || 0) * 2460;
    const usdtValue = parseFloat(balances[USDT] || 0) * 1;
    const usdcValue = parseFloat(balances[USDC] || 0) * 1;
    
    return ethValue + usdtValue + usdcValue;
  }, [balances]);

  // Don't render until mounted
  if (!isMounted) {
    return (
      <div className="border border-[#7765F3] bg-gradient-to-r from-[#7765F3] to-[#4D44B5] w-full max-w-xl p-4 px-6 rounded-xl">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" color="white" />
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="border border-[#7765F3] bg-gradient-to-r from-[#7765F3] to-[#4D44B5] w-full max-w-xl p-4 px-6 rounded-xl">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <svg className="h-12 w-12 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <p className="text-white text-lg font-medium">Connect your wallet to view balances</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#7765F3] bg-gradient-to-r from-[#7765F3] to-[#4D44B5] w-full max-w-xl p-4 px-6 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between py-4 px-1">
        <p className="text-white font-semibold text-xl">Wallet</p>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchBalances}
            disabled={isLoading}
            className="text-white hover:text-gray-300 transition-colors disabled:opacity-50"
            title="Refresh balances"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="bg-[#212429] p-4 py-6 rounded-xl mb-4 border-2 border-transparent hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm">Connected Address</p>
            <p className="text-white font-mono text-lg">{formatAddress(address)}</p>
          </div>
          <button
            onClick={copyAddress}
            className="bg-[#7765F3] hover:bg-[#4D44B5] text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4">
        <button
          onClick={() => setActiveTab("balances")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "balances"
              ? "bg-[#7765F3] text-white"
              : "bg-[#212429] text-zinc-400 hover:text-white"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span>Balances</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "transactions"
              ? "bg-[#7765F3] text-white"
              : "bg-[#212429] text-zinc-400 hover:text-white"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>History</span>
          </div>
        </button>
      </div>

      {/* Balances Tab */}
      {activeTab === "balances" && (
        <div className="space-y-3">
          {/* Total Portfolio Value */}
          <div className="bg-[#212429] p-4 rounded-xl border-2 border-transparent hover:border-zinc-700 transition-colors">
            <p className="text-zinc-400 text-sm">Total Portfolio Value</p>
            <p className="text-white text-2xl font-bold">${calculateTotalValue().toFixed(2)}</p>
          </div>

          {/* Token Balances */}
          {[ETH, USDT, USDC].map((token) => (
            <div
              key={token}
              className="bg-[#212429] p-4 rounded-xl border-2 border-transparent hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{token}</p>
                  <p className="text-zinc-400 text-sm">
                    {isLoading ? "Loading..." : `${parseFloat(balances[token] || 0).toFixed(6)}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">
                    {token === ETH 
                      ? `$${(parseFloat(balances[token] || 0) * 2460).toFixed(2)}`
                      : `$${parseFloat(balances[token] || 0).toFixed(2)}`
                    }
                  </p>
                  <p className="text-zinc-400 text-xs">
                    {token === ETH ? "$2,460/ETH" : "$1.00/token"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="bg-[#212429] p-4 rounded-xl border-2 border-transparent hover:border-zinc-700 transition-colors">
          <div className="text-center py-8">
            <svg className="h-12 w-12 text-zinc-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-zinc-400">Transaction history coming soon</p>
            <p className="text-zinc-500 text-sm mt-2">
              View your recent swaps and transfers
            </p>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default Wallet;

