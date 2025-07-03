import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  hasValidBalance,
  swapEthToToken,
  swapTokenToEth,
  swapTokenToToken,
  increaseAllowance,
  getTokenBalance,
  getTokenPrice,
} from "../utils/context";

import { CogIcon, ArrowSmDownIcon } from "@heroicons/react/outline";
import SwapField from "./SwapField";
import TransactionStatus from "./TransactionStatus";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";
import { DEFAULT_VALUE, ETH, USDT, USDC } from "../utils/saleToken";
import { toEth, toWei } from "../utils/utils";
import { useMetaMask } from "../utils/MetaMaskContext";

// Constants
const INCREASE_ALLOWANCE = "Increase Allowance";
const ENTER_AMOUNT = "Enter Amount";
const SELECT_TOKEN = "Select Token";
const CONNECT_WALLET = "Wallet is not connected";
const SWAP = "Swap";

const SwapComponent = ({ onSwapSuccess, onTransactionComplete }) => {
  // State management
  const [srcToken, setSrcToken] = useState(ETH);
  const [destToken, setDestToken] = useState(DEFAULT_VALUE);
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [swapBtnText, setSwapBtnText] = useState(ENTER_AMOUNT);
  const [txPending, setTxPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [tokenPrices, setTokenPrices] = useState({});
  const [isTokenSelecting, setIsTokenSelecting] = useState(false);
  const [currentExchangeRate, setCurrentExchangeRate] = useState(null);
  const [tokenBalances, setTokenBalances] = useState({});

  // Refs
  const inputValueRef = useRef();
  const outputValueRef = useRef();
  const isReversed = useRef(false);

  // MetaMask hooks
  const { account, isClient, getEthBalance } = useMetaMask();

  // Toast notifications - defined early to avoid circular dependencies
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

  // Fetch token prices
  const fetchTokenPrices = useCallback(async () => {
    if (!isClient) return;

    try {
      const prices = {};
      const tokens = [ETH, USDT, USDC];

      // Set ETH price to 1 (base currency)
      prices[ETH] = 1;

      for (const token of tokens) {
        if (token !== ETH) {
          const price = await getTokenPrice(token);
          prices[token] = toEth(price, 18);
        }
      }

      // Override with correct USD prices for accurate exchange rates
      // 1 ETH = $2460, so 1 USDT/USDC = 1/2460 ETH
      prices[USDT] = 1 / 2460; // $1.00 USDT = 1/2460 ETH
      prices[USDC] = 1 / 2460; // $1.00 USDC = 1/2460 ETH

      setTokenPrices(prices);
    } catch (error) {
      console.error("Error fetching token prices:", error);
    }
  }, [isClient]);

  // Fetch token balances
  const fetchTokenBalances = useCallback(async () => {
    if (!isClient || !account) return;

    try {
      const balances = {};
      
      // Fetch ETH balance using the correct method
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
      
      console.log("Fetched token balances:", balances);
      setTokenBalances(balances);
    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  }, [account, isClient, getEthBalance]);

  // Refresh prices manually
  const refreshPrices = useCallback(async () => {
    await fetchTokenPrices();
    await fetchTokenBalances();
    notifySuccess("Token prices and balances refreshed");
  }, [fetchTokenPrices, fetchTokenBalances, notifySuccess]);

  // Fetch prices and balances on mount
  useEffect(() => {
    if (isMounted && isClient) {
      fetchTokenPrices();
      fetchTokenBalances();
    }
  }, [isMounted, isClient, fetchTokenPrices, fetchTokenBalances]);

  // Calculate output value based on input and tokens
  const populateOutputValue = useCallback(
    (value) => {
      if (
        destToken === DEFAULT_VALUE ||
        srcToken === DEFAULT_VALUE ||
        !value ||
        parseFloat(value) <= 0
      ) {
        return;
      }

      try {
        const inputAmount = parseFloat(value);

        if (srcToken !== ETH && destToken !== ETH) {
          // Token to token swap - use price ratio
          const srcPrice = tokenPrices[srcToken] || 1;
          const destPrice = tokenPrices[destToken] || 1;
          const outValue = (inputAmount * srcPrice) / destPrice;
          setOutputValue(outValue.toFixed(6));
        } else if (srcToken === ETH && destToken !== ETH) {
          // ETH to token - use token price
          const tokenPrice = tokenPrices[destToken] || 1;
          const outValue = inputAmount / tokenPrice;
          setOutputValue(outValue.toFixed(6));
        } else if (srcToken !== ETH && destToken === ETH) {
          // Token to ETH - use token price
          const tokenPrice = tokenPrices[srcToken] || 1;
          const outValue = inputAmount * tokenPrice;
          setOutputValue(outValue.toFixed(6));
        }
      } catch (error) {
        console.error("Error calculating output value:", error);
        // Don't reset to 0, just log the error
        notifyError("Error calculating output value");
      }
    },
    [destToken, srcToken, tokenPrices, notifyError]
  );

  // Calculate input value based on output and tokens
  const populateInputValue = useCallback(
    (value) => {
      if (
        srcToken === DEFAULT_VALUE ||
        destToken === DEFAULT_VALUE ||
        !value ||
        parseFloat(value) <= 0
      ) {
        return;
      }

      try {
        const outputAmount = parseFloat(value);

        if (srcToken !== ETH && destToken !== ETH) {
          // Token to token swap - use price ratio
          const srcPrice = tokenPrices[srcToken] || 1;
          const destPrice = tokenPrices[destToken] || 1;
          const inValue = (outputAmount * destPrice) / srcPrice;
          setInputValue(inValue.toFixed(6));
        } else if (srcToken === ETH && destToken !== ETH) {
          // ETH to token - use token price
          const tokenPrice = tokenPrices[destToken] || 1;
          const inValue = outputAmount * tokenPrice;
          setInputValue(inValue.toFixed(6));
        } else if (srcToken !== ETH && destToken === ETH) {
          // Token to ETH - use token price
          const tokenPrice = tokenPrices[srcToken] || 1;
          const inValue = outputAmount / tokenPrice;
          setInputValue(inValue.toFixed(6));
        }
      } catch (error) {
        console.error("Error calculating input value:", error);
        // Don't reset to 0, just log the error
        notifyError("Error calculating input value");
      }
    },
    [srcToken, destToken, tokenPrices, notifyError]
  );

  // Memoized token objects to prevent unnecessary re-renders
  const srcTokenObj = useMemo(
    () => ({
      id: "srcToken",
      value: inputValue,
      setValue: setInputValue,
      defaultValue: srcToken,
      ignoreValue: destToken,
      setToken: (token) => {
        setIsTokenSelecting(true);
        setSrcToken(token);
        // Reset the flag after a short delay to allow the token change to complete
        setTimeout(() => setIsTokenSelecting(false), 100);
      },
      disabled: destToken === DEFAULT_VALUE,
    }),
    [inputValue, srcToken, destToken]
  );

  const destTokenObj = useMemo(
    () => ({
      id: "destToken",
      value: outputValue,
      setValue: setOutputValue,
      defaultValue: destToken,
      ignoreValue: srcToken,
      setToken: (token) => {
        setIsTokenSelecting(true);
        setDestToken(token);
        // Reset the flag after a short delay to allow the token change to complete
        setTimeout(() => setIsTokenSelecting(false), 100);
      },
      disabled: destToken === DEFAULT_VALUE,
    }),
    [outputValue, destToken, srcToken]
  );

  // Update swap button text based on conditions
  useEffect(() => {
    if (!isMounted || !isClient) return;

    if (!account) {
      setSwapBtnText(CONNECT_WALLET);
    } else if (srcToken === DEFAULT_VALUE) {
      setSwapBtnText("Select From Token");
    } else if (destToken === DEFAULT_VALUE) {
      setSwapBtnText("Select To Token");
    } else if (!inputValue || parseFloat(inputValue) <= 0) {
      setSwapBtnText("Enter Amount");
    } else {
      setSwapBtnText(SWAP);
    }
  }, [inputValue, account, isMounted, isClient, srcToken, destToken]);

  // Handle input value changes and populate output
  useEffect(() => {
    if (!isMounted || !isClient || isTokenSelecting) return;

    // Only recalculate if there's a valid input value and we're not currently editing the output field
    if (
      inputValue &&
      parseFloat(inputValue) > 0 &&
      document.activeElement !== outputValueRef.current &&
      document.activeElement?.ariaLabel !== "srcToken" &&
      !isReversed.current
    ) {
      populateOutputValue(inputValue);
    }

    // Clear output only if input is completely empty
    if (inputValue?.length === 0) {
      setOutputValue("");
    }
  }, [inputValue, destToken, isMounted, isClient, populateOutputValue, isTokenSelecting]);

  // Handle output value changes and populate input
  useEffect(() => {
    if (!isMounted || !isClient || isTokenSelecting) return;

    // Only recalculate if there's a valid output value and we're not currently editing the input field
    if (
      outputValue &&
      parseFloat(outputValue) > 0 &&
      document.activeElement !== inputValueRef.current &&
      document.activeElement?.ariaLabel !== "destToken" &&
      isReversed.current
    ) {
      populateInputValue(outputValue);
    }

    // Clear input only if output is completely empty
    if (outputValue?.length === 0) {
      setInputValue("");
    }

    // Reset the reversed flag after processing
    if (isReversed.current) {
      // Use a small delay to ensure all state updates are processed
      setTimeout(() => {
        isReversed.current = false;
      }, 100);
    }
  }, [outputValue, srcToken, isMounted, isClient, populateInputValue, isTokenSelecting]);

  // Handle swap button click
  const handleSwapClick = useCallback(async () => {
    if (!isClient) return;

    if (swapBtnText === INCREASE_ALLOWANCE) {
      await handleIncreaseAllowance();
    } else if (swapBtnText === SWAP) {
      await handleSwap();
    }
  }, [swapBtnText, isClient]);

  // Handle swap execution
  const handleSwap = useCallback(async () => {
    if (!isClient) return;

    if (!account) {
      notifyError("Please connect your wallet");
      return;
    }

    if (!inputValue || !outputValue || parseFloat(inputValue) <= 0) {
      notifyError("Please enter a valid amount");
      return;
    }

    if (srcToken === ETH && destToken !== ETH) {
      // ETH to token swap - no allowance needed
      await performSwap();
    } else {
      // Token swaps require allowance check
      setIsLoading(true);
      try {
        const result = await hasValidBalance(account, srcToken, inputValue);
        if (result) {
          await performSwap();
        } else {
          handleInsufficientAllowance();
        }
      } catch (error) {
        console.error("Error checking allowance:", error);
        notifyError("Error checking token allowance");
      } finally {
        setIsLoading(false);
      }
    }
  }, [
    account,
    inputValue,
    outputValue,
    srcToken,
    destToken,
    notifyError,
    isClient,
  ]);

  // Handle insufficient allowance
  const handleInsufficientAllowance = useCallback(() => {
    setSwapBtnText(INCREASE_ALLOWANCE);
    notifyError("Insufficient allowance. Please increase allowance first.");
  }, [notifyError]);

  // Handle increase allowance
  const handleIncreaseAllowance = useCallback(async () => {
    if (!isClient) return;

    setTxPending(true);
    try {
      const receipt = await increaseAllowance(srcToken, inputValue);
      if (receipt && receipt.transactionHash) {
        setSwapBtnText(SWAP);
        notifySuccess("Allowance increased successfully");
      } else {
        notifyError(receipt?.message || "Failed to increase allowance");
      }
    } catch (error) {
      console.error("Error increasing allowance:", error);
      notifyError("Failed to increase allowance");
    } finally {
      setTxPending(false);
    }
  }, [srcToken, inputValue, notifyError, notifySuccess, isClient]);

  // Perform the actual swap
  const performSwap = useCallback(async () => {
    if (!isClient) return;

    setTxPending(true);
    let receipt;

    try {
      if (srcToken === ETH && destToken !== ETH) {
        receipt = await swapEthToToken(destToken, inputValue);
      } else if (srcToken !== ETH && destToken === ETH) {
        receipt = await swapTokenToEth(srcToken, inputValue);
      } else if (srcToken !== ETH && destToken !== ETH) {
        // Token to token swap
        receipt = await swapTokenToToken(srcToken, destToken, inputValue);
      } else {
        notifyError("Invalid swap combination");
        return;
      }

      if (receipt && receipt.transactionHash) {
        notifySuccess("Swap successful!");
        
        // Record the transaction
        if (onTransactionComplete) {
          const transaction = {
            hash: receipt.transactionHash,
            fromToken: srcToken,
            toToken: destToken,
            fromAmount: inputValue,
            toAmount: outputValue,
            status: 'success',
            timestamp: Date.now(),
            type: 'swap'
          };
          onTransactionComplete(transaction);
        }
        
        // Clear form after successful swap
        setInputValue("");
        setOutputValue("");
        // Trigger balance update if callback is provided
        if (onSwapSuccess) {
          onSwapSuccess();
        }
        
        // Refresh token balances after successful swap
        fetchTokenBalances();
      } else {
        notifyError(receipt?.message || "Swap failed");
      }
    } catch (error) {
      console.error("Swap error:", error);
      notifyError("Swap failed. Please try again.");
    } finally {
      setTxPending(false);
    }
  }, [srcToken, destToken, inputValue, notifyError, notifySuccess, isClient, onSwapSuccess]);

  // Handle percentage button clicks
  const handlePercentageClick = useCallback((percentage) => {
    console.log("Percentage click:", { percentage, srcToken, tokenBalances });
    
    if (!srcToken || srcToken === DEFAULT_VALUE) {
      notifyError("Please select a token first");
      return;
    }

    const balance = tokenBalances[srcToken];
    console.log("Balance for", srcToken, ":", balance);
    
    if (!balance || parseFloat(balance) <= 0) {
      notifyError("No balance available for this token");
      return;
    }

    const amount = (parseFloat(balance) * percentage) / 100;
    console.log("Calculated amount:", amount);
    setInputValue(amount.toFixed(6));
  }, [srcToken, tokenBalances, notifyError]);

  // Handle reverse exchange
  const handleReverseExchange = useCallback(() => {
    isReversed.current = true;

    // Store current values before swapping
    const currentInputValue = inputValue;
    const currentOutputValue = outputValue;
    const currentSrcToken = srcToken;
    const currentDestToken = destToken;

    // Swap tokens first
    setSrcToken(currentDestToken);
    setDestToken(currentSrcToken);

    // Swap values after a brief delay to ensure token state is updated
    setTimeout(() => {
      setInputValue(currentOutputValue);
      setOutputValue(currentInputValue);
    }, 50);

    // Force exchange rate update
    setTimeout(() => {
      setExchangeRateKey(prev => prev + 1);
    }, 100);
  }, [inputValue, outputValue, srcToken, destToken]);

  // Get swap button className
  const getSwapBtnClassName = useCallback(() => {
    let className =
      "p-6 w-full my-2 rounded-lg text-lg font-medium transition-all duration-200";

    // Check if both tokens are selected and amount is entered
    const isReady = srcToken && destToken && 
                   srcToken !== DEFAULT_VALUE && 
                   destToken !== DEFAULT_VALUE && 
                   inputValue && 
                   parseFloat(inputValue) > 0;

    if (!isReady) {
      // Disabled state - gray background, no hover effects
      className += " bg-gray-600 text-gray-400 cursor-not-allowed";
    } else if (swapBtnText === INCREASE_ALLOWANCE) {
      className += " bg-yellow-600 hover:bg-yellow-700 text-white cursor-pointer";
    } else if (swapBtnText === SWAP) {
      className += " bg-lime-500 hover:bg-lime-600 text-white cursor-pointer";
    } else {
      // Other states (SELECT_TOKEN, ENTER_AMOUNT, CONNECT_WALLET)
      className += " bg-gray-600 text-gray-400 cursor-not-allowed";
    }

    if (isLoading || txPending) {
      className += " opacity-50 pointer-events-none";
    }

    return className;
  }, [swapBtnText, isLoading, txPending, srcToken, destToken, inputValue]);

  // Get current exchange rate
  const getExchangeRate = useCallback(() => {
    // Check if both tokens are selected and valid
    if (
      !srcToken ||
      !destToken ||
      srcToken === DEFAULT_VALUE ||
      destToken === DEFAULT_VALUE ||
      srcToken === destToken
    ) {
      return null;
    }

    // Check if token prices are available
    if (Object.keys(tokenPrices).length === 0) {
      return null;
    }

    try {
      if (srcToken !== ETH && destToken !== ETH) {
        // Token to token
        const srcPrice = tokenPrices[srcToken];
        const destPrice = tokenPrices[destToken];
        if (!srcPrice || !destPrice) {
          return null;
        }
        return (srcPrice / destPrice).toFixed(6);
      } else if (srcToken === ETH && destToken !== ETH) {
        // ETH to token
        const tokenPrice = tokenPrices[destToken];
        if (!tokenPrice) {
          return null;
        }
        return (1 / tokenPrice).toFixed(6);
      } else if (srcToken !== ETH && destToken === ETH) {
        // Token to ETH
        const tokenPrice = tokenPrices[srcToken];
        if (!tokenPrice) {
          return null;
        }
        return tokenPrice.toFixed(6);
      }
      return null;
    } catch (error) {
      console.error("Error calculating exchange rate:", error);
      return null;
    }
  }, [srcToken, destToken, tokenPrices]);

  // Force exchange rate recalculation when tokens change
  const [exchangeRateKey, setExchangeRateKey] = useState(0);
  
  useEffect(() => {
    if (srcToken && destToken && srcToken !== DEFAULT_VALUE && destToken !== DEFAULT_VALUE) {
      setExchangeRateKey(prev => prev + 1);
    }
  }, [srcToken, destToken, tokenPrices]);

  // Update exchange rate whenever tokens or prices change
  useEffect(() => {
    if (!isTokenSelecting && srcToken && destToken && srcToken !== DEFAULT_VALUE && destToken !== DEFAULT_VALUE && Object.keys(tokenPrices).length > 0) {
      const rate = getExchangeRate();
      setCurrentExchangeRate(rate);
    } else {
      setCurrentExchangeRate(null);
    }
  }, [srcToken, destToken, tokenPrices, isTokenSelecting, getExchangeRate]);

  // Force exchange rate recalculation when token selection is complete
  useEffect(() => {
    if (!isTokenSelecting && srcToken && destToken && srcToken !== DEFAULT_VALUE && destToken !== DEFAULT_VALUE) {
      setExchangeRateKey(prev => prev + 1);
    }
  }, [isTokenSelecting, srcToken, destToken]);

  // Fetch balances when source token changes
  useEffect(() => {
    if (srcToken && srcToken !== DEFAULT_VALUE && account && isClient) {
      fetchTokenBalances();
    }
  }, [srcToken, account, isClient, fetchTokenBalances]);

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

  return (
    <div
      className="  border-2 border-[#7765F3]
     w-full p-4 px-4 rounded-xl"
    >
      <div className="flex items-center justify-between py-4 px-1">
        <p className="text-white font-semibold text-xl">Swap Token</p>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshPrices}
            className="text-white hover:text-gray-300 transition-colors"
            title="Refresh token prices"
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
          <CogIcon className="h-7 text-white cursor-pointer hover:text-gray-300 transition-colors" />
        </div>
      </div>

      <div className="pl-2 text-sm text-zinc-300 mb-2">
          FROM
        </div>

      {/* Percentage Buttons */}
      {srcToken && srcToken !== DEFAULT_VALUE && destToken && destToken !== DEFAULT_VALUE && (
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="flex space-x-2">
            {[25, 50, 100].map((percentage) => (
              <button
                key={percentage}
                onClick={() => handlePercentageClick(percentage)}
                className="px-3 py-1 text-xs font-medium rounded-lg bg-[#2C2F36] text-zinc-300 hover:bg-[#7765F3] hover:text-white transition-all duration-200"
                title={`Use ${percentage}% of ${srcToken} balance`}
              >
                {percentage}%
              </button>
            ))}
          </div>
          <div className="text-right">
            <p className="text-zinc-400 text-xs">Balance</p>
            <p className="text-white text-xs font-medium">
              {tokenBalances[srcToken] ? parseFloat(tokenBalances[srcToken]).toFixed(4) : "0.0000"} {srcToken}
            </p>
          </div>
        </div>
      )}

      <div className="relative bg-[#212429] p-4 py-6 rounded-xl mb-2 border-2 border-transparent hover:border-zinc-700 transition-colors">
        <SwapField obj={srcTokenObj} ref={inputValueRef} />
        <ArrowSmDownIcon
          className="absolute left-1/2 -translate-x-1/2 -bottom-6 h-10 p-1 bg-[#212429] 
            border-4 border-zinc-900 text-zinc-300 rounded-xl cursor-pointer hover:scale-110 transition-all duration-300"
          onClick={handleReverseExchange}
        />
      </div>

     

      <div className="pl-2 text-sm text-zinc-300 mb-2">
          TO
        </div>

      <div className="bg-[#212429] p-4 py-6 rounded-xl mb-2 border-2 border-transparent hover:border-zinc-700 transition-colors">
        <SwapField obj={destTokenObj} ref={outputValueRef} />
      </div>

       {/* Exchange Rate Display */}
       {currentExchangeRate && (
        <div key={exchangeRateKey} className="text-center py-2 px-4 bg-[#1a1d21] rounded-lg mb-2 border border-zinc-700">
          <span className="text-sm text-zinc-400">Exchange Rate: </span>
          <span className="text-sm text-white font-medium">
            1 {srcToken} = {currentExchangeRate} {destToken}
          </span>
        </div>
      )}

      <button
        className={getSwapBtnClassName()}
        onClick={handleSwapClick}
        disabled={isLoading || txPending || !srcToken || !destToken || srcToken === DEFAULT_VALUE || destToken === DEFAULT_VALUE || !inputValue || parseFloat(inputValue) <= 0}
      >
        {isLoading || txPending ? "Processing..." : swapBtnText}
      </button>

      {txPending && <TransactionStatus />}
    </div>
  );
};

export default SwapComponent;
