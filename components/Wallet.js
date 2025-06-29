import React, { useState, useEffect, useCallback } from "react";
import { useMetaMask } from "../utils/MetaMaskContext";
import { getTokenBalance, getTokenAddress } from "../utils/context";
import { ETH, USDT, USDC } from "../utils/saleToken";
import { toEth } from "../utils/utils";
import LoadingSpinner from "./LoadingSpinner";
import PortfolioChart from "./PortfolioChart";
import toast, { Toaster } from "react-hot-toast";
import SwapComponent from "./SwapComponent";
import MetaMaskConnect from "./MetaMaskConnect";

const Wallet = () => {
  const [balances, setBalances] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("portfolio");

  const { account, getEthBalance, isClient } = useMetaMask();

  // Toast notifications
  const notifyError = useCallback(
    (msg) => toast.error(msg, { duration: 5000 }),
    []
  );
  const notifySuccess = useCallback(
    (msg) => toast.success(msg, { duration: 5000 }),
    []
  );

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch all token balances
  const fetchBalances = useCallback(async () => {
    if (!isClient || !account) return;

    setIsLoading(true);
    try {
      const newBalances = {};

      // Fetch ETH balance using the context method
      const ethBalance = await getEthBalance(account);
      newBalances[ETH] = ethBalance;

      // Fetch token balances
      const tokens = [USDT, USDC];
      for (const token of tokens) {
        try {
          const balance = await getTokenBalance(token, account);
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
  }, [account, getEthBalance, isClient, notifyError, notifySuccess]);

  // Fetch balances on mount and when address changes
  useEffect(() => {
    if (isMounted && account && isClient) {
      fetchBalances();
    }
  }, [isMounted, account, isClient, fetchBalances]);

  // Copy address to clipboard
  const copyAddress = useCallback(() => {
    if (account && isClient) {
      navigator.clipboard.writeText(account);
      notifySuccess("Address copied to clipboard");
    }
  }, [account, isClient, notifySuccess]);

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

  // Don't render until mounted and client-side hydration is complete
  if (!isMounted || !isClient) {
    return (
      <div className="border border-[#7765F3] bg-gradient-to-r from-[#7765F3] to-[#4D44B5] w-full max-w-xl p-4 px-6 rounded-xl">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" color="white" />
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className=" w-full max-w-xl rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 px-1">
          <p className="text-white font-semibold text-xl">Wallet</p>
          <div className="flex items-center space-x-2">
            <button
              // onClick={fetchBalances}
              // disabled={isLoading}
              className="text-white hover:text-gray-300 transition-colors disabled:opacity-50"
              title="Refresh balances"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Wallet Address */}
        <div className="bg-[#212429] p-4 py-6 rounded-xl mb-4 border-2 border-transparent hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">No Address Connected</p>
              <p className="text-white font-mono text-sm sm:text-lg">
                {formatAddress("0xC123eA6Ef52441B16123e16f51E1d66728444567")}
              </p>
            </div>

            <MetaMaskConnect />
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
              <svg
                className="h-4 w-4 hidden sm:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span>Balances</span>
            </div>
          </button>
          {/* <button
          onClick={() => setActiveTab("portfolio")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "portfolio"
              ? "bg-[#7765F3] text-white"
              : "bg-[#212429] text-zinc-400 hover:text-white"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Portfolio</span>
          </div>
        </button> */}
          <button
            onClick={() => setActiveTab("swap")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "swap"
                ? "bg-[#7765F3] text-white"
                : "bg-[#212429] text-zinc-400 hover:text-white"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="h-4 w-4 hidden sm:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <span>Swap</span>
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
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>History</span>
            </div>
          </button>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <svg
              className="h-12 w-12 text-white mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <p className="text-white text-lg font-medium">
              Connect your wallet to view balances
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="  w-full max-w-xl py-4 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 px-1">
        <p className="text-white font-semibold text-xl">Wallet</p>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchBalances}
            disabled={isLoading}
            className="text-white hover:text-gray-300 transition-colors disabled:opacity-50"
            title="Refresh balances"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="bg-[#212429] p-4 py-6 rounded-xl mb-4 border-2 border-transparent hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm">Connected Address</p>
            <p className="text-white font-mono text-lg">
              {formatAddress(account)}
            </p>
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
        {/* <button
          onClick={() => setActiveTab("balances")}
          className={`flex-1 py-2 lg:px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "balances"
              ? "bg-[#7765F3] text-white"
              : "bg-[#212429] text-zinc-400 hover:text-white"
          }`}
        >
          <div className="flex items-center justify-center space-x-1">
            <svg
              className="h-4 w-4 hidden sm:block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span>Balances</span>
          </div>
        </button> */}
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`flex-1 py-2 lg:px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "portfolio"
              ? "bg-[#7765F3] text-white"
              : "bg-[#212429] text-zinc-400 hover:text-white"
          }`}
        >
          <div className="flex items-center justify-center space-x-1">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>Portfolio</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("swap")}
          className={`flex-1 py-2 lg:px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "swap"
              ? "bg-[#7765F3] text-white"
              : "bg-[#212429] text-zinc-400 hover:text-white"
          }`}
        >
          <div className="flex items-center justify-center space-x-1">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <span>Swap</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex-1 py-2 lg:px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "transactions"
              ? "bg-[#7765F3] text-white"
              : "bg-[#212429] text-zinc-400 hover:text-white"
          }`}
        >
          <div className="flex items-center justify-center space-x-1">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>History</span>
          </div>
        </button>
      </div>

      {/* Balances Tab */}
      {activeTab === "portfolio" && (
        <div className="space-y-3">
          <PortfolioChart />
          {/* Total Portfolio Value */}
          {/* <div className="bg-[#212429] p-4 rounded-xl border-2 border-transparent hover:border-zinc-700 transition-colors">
            <p className="text-zinc-400 text-sm">Total Portfolio Value</p>
            <p className="text-white text-2xl font-bold">
              ${calculateTotalValue().toFixed(2)}
            </p>
          </div> */}

          {/* ETH Balance */}
          <div className="bg-[#212429] p-4 rounded-xl border-2 border-transparent hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Ξ</span>
                </div>
                <div>
                  <p className="text-white font-medium">Ethereum</p>
                  <p className="text-zinc-400 text-sm">ETH</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  {parseFloat(balances[ETH] || 0).toFixed(4)}
                </p>
                <p className="text-zinc-400 text-sm">
                  ${(parseFloat(balances[ETH] || 0) * 2460).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* USDT Balance */}
          <div className="bg-[#212429] p-4 rounded-xl border-2 border-transparent hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
                <div>
                  <p className="text-white font-medium">Tether USD</p>
                  <p className="text-zinc-400 text-sm">USDT</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  {parseFloat(balances[USDT] || 0).toFixed(2)}
                </p>
                <p className="text-zinc-400 text-sm">
                  ${parseFloat(balances[USDT] || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* USDC Balance */}
          <div className="bg-[#212429] p-4 rounded-xl border-2 border-transparent hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
                <div>
                  <p className="text-white font-medium">USD Coin</p>
                  <p className="text-zinc-400 text-sm">USDC</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  {parseFloat(balances[USDC] || 0).toFixed(2)}
                </p>
                <p className="text-zinc-400 text-sm">
                  ${parseFloat(balances[USDC] || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Swap Tab */}
      {activeTab === "swap" && <SwapComponent />}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="bg-[#212429] p-4 rounded-xl border-2 border-transparent hover:border-zinc-700 transition-colors">
          <div className="text-center py-8">
            <svg
              className="h-12 w-12 text-zinc-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-zinc-400 text-sm">
              Transaction history coming soon
            </p>
          </div>
        </div>
      )}
      <MetaMaskConnect />
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Wallet;
