import React, { useState, useEffect, useCallback } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import { useMetaMask } from "../utils/MetaMaskContext";
import { getTokenBalance } from "../utils/context";
import { ETH, USDT, USDC } from "../utils/saleToken";
import { toEth } from "../utils/utils";
import LoadingSpinner from "./LoadingSpinner";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PortfolioChart = () => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  const { account, getEthBalance, isClient } = useMetaMask();

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch portfolio data and create chart data
  const fetchPortfolioData = useCallback(async () => {
    if (!isClient || !account) return;

    setIsLoading(true);
    try {
      const balances = {};
      
      // Fetch ETH balance
      const ethBalance = await getEthBalance(account);
      balances[ETH] = ethBalance;

      // Fetch token balances
      const tokens = [USDT, USDC];
      for (const token of tokens) {
        try {
          const balance = await getTokenBalance(token, account);
          balances[token] = toEth(balance, 18);
        } catch (error) {
          console.error(`Error fetching ${token} balance:`, error);
          balances[token] = "0";
        }
      }

      // Calculate USD values (using current prices)
      const ethValue = parseFloat(balances[ETH] || 0) * 2460; // $2460 per ETH
      const usdtValue = parseFloat(balances[USDT] || 0) * 1; // $1 per USDT
      const usdcValue = parseFloat(balances[USDC] || 0) * 1; // $1 per USDC

      const total = ethValue + usdtValue + usdcValue;
      setTotalValue(total);

      // Create chart data for Chart.js
      const chartDataConfig = {
        labels: ["ETH", "USDT", "USDC"],
        datasets: [
          {
            data: [ethValue, usdtValue, usdcValue],
            backgroundColor: [
              "#343434", // Ethereum (matches SVG)
              "#50af95", // Tether (matches SVG)
              "#2775ca", // USDC (matches SVG)
            ],
            borderColor: [
              "#343434", // Ethereum
              "#50af95", // Tether
              "#2775ca", // USDC
            ],
            borderWidth: 2,
            hoverBorderWidth: 3,
            hoverOffset: 4,
          },
        ],
      };

      setChartData(chartDataConfig);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [account, getEthBalance, isClient]);

  // Fetch data on mount and when address changes
  useEffect(() => {
    if (isMounted && account && isClient) {
      fetchPortfolioData();
    }
  }, [isMounted, account, isClient, fetchPortfolioData]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#D1D5DB", // Light gray text
          font: {
            size: 10,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#D1D5DB",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed;
            const percentage = ((value / totalValue) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
      title: {
        display: false,
      },
    },
    cutout: "90%", // Makes it a donut chart with larger center hole
  };

  // Don't render until mounted and client-side hydration is complete
  if (!isMounted || !isClient) {
    return (
      <div className="bg-[#212429] p-6 rounded-xl border-2 border-transparent hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" color="white" />
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="bg-[#212429] p-6 rounded-xl border-2 border-transparent hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <svg className="h-12 w-12 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-white text-lg font-medium">Connect your wallet to view portfolio</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-[#212429] p-6 rounded-xl border-2 border-transparent hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" color="white" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#212429] p-6 rounded-xl border-2 border-transparent hover:border-zinc-700 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h3 className="text-white font-semibold text-xl">Portfolio Distribution</h3>
          <p className="text-zinc-400 text-sm">Token allocation overview</p>
        </div>
        <button
          onClick={fetchPortfolioData}
          disabled={isLoading}
          className="text-white hover:text-gray-300 transition-colors disabled:opacity-50"
          title="Refresh portfolio"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Chart Container */}
      <div className="relative">
        {chartData && totalValue > 0 ? (
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Donut Chart with centered text */}
            <div className="flex-1 min-h-[300px] flex items-center justify-center">
              <div className="relative w-80 h-80">
                <Doughnut data={chartData} options={chartOptions} />
                {/* Total value text positioned in center of donut */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[120%] pointer-events-none text-center">
                  <p className="text-zinc-400 text-sm mb-1">Total Value</p>
                  <p className="text-white text-2xl font-bold">${totalValue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="h-16 w-16 text-zinc-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-zinc-400 text-lg">No tokens found in wallet</p>
            <p className="text-zinc-500 text-sm mt-2">Add some tokens to see your portfolio distribution</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioChart; 