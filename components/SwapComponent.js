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
const CONNECT_WALLET = "Wallet is not connected";
const SWAP = "Swap";

const SwapComponent = () => {
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

  // Refs
  const inputValueRef = useRef();
  const outputValueRef = useRef();
  const isReversed = useRef(false);

  // MetaMask hooks
  const { account, isClient } = useMetaMask();

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

      for (const token of tokens) {
        if (token !== ETH) {
          const price = await getTokenPrice(token);
          prices[token] = toEth(price, 18);
        }
      }

      setTokenPrices(prices);
    } catch (error) {
      console.error("Error fetching token prices:", error);
    }
  }, [isClient]);

  // Refresh prices manually
  const refreshPrices = useCallback(async () => {
    await fetchTokenPrices();
    notifySuccess("Token prices refreshed");
  }, [fetchTokenPrices, notifySuccess]);

  // Fetch prices on mount
  useEffect(() => {
    if (isMounted && isClient) {
      fetchTokenPrices();
    }
  }, [isMounted, isClient, fetchTokenPrices]);

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
        setOutputValue("0");
        notifyError("Invalid input value");
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
        setInputValue("0");
        notifyError("Invalid input value");
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
      setToken: setSrcToken,
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
      setToken: setDestToken,
    }),
    [outputValue, destToken, srcToken]
  );

  // Update swap button text based on conditions
  useEffect(() => {
    if (!isMounted || !isClient) return;

    if (!account) {
      setSwapBtnText(CONNECT_WALLET);
    } else if (!inputValue || !outputValue || parseFloat(inputValue) <= 0) {
      setSwapBtnText(ENTER_AMOUNT);
    } else {
      setSwapBtnText(SWAP);
    }
  }, [inputValue, outputValue, account, isMounted, isClient]);

  // Handle input value changes and populate output
  useEffect(() => {
    if (!isMounted || !isClient) return;

    if (
      document.activeElement !== outputValueRef.current &&
      document.activeElement?.ariaLabel !== "srcToken" &&
      !isReversed.current
    ) {
      populateOutputValue(inputValue);
    }

    if (inputValue?.length === 0) {
      setOutputValue("");
    }
  }, [inputValue, destToken, isMounted, isClient, populateOutputValue]);

  // Handle output value changes and populate input
  useEffect(() => {
    if (!isMounted || !isClient) return;

    if (
      document.activeElement !== inputValueRef.current &&
      document.activeElement?.ariaLabel !== "destToken" &&
      isReversed.current
    ) {
      populateInputValue(outputValue);
    }

    if (outputValue?.length === 0) {
      setInputValue("");
    }

    if (isReversed.current) {
      isReversed.current = false;
    }
  }, [outputValue, srcToken, isMounted, isClient, populateInputValue]);

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
        // Clear form after successful swap
        setInputValue("");
        setOutputValue("");
      } else {
        notifyError(receipt?.message || "Swap failed");
      }
    } catch (error) {
      console.error("Swap error:", error);
      notifyError("Swap failed. Please try again.");
    } finally {
      setTxPending(false);
    }
  }, [srcToken, destToken, inputValue, notifyError, notifySuccess, isClient]);

  // Handle reverse exchange
  const handleReverseExchange = useCallback(() => {
    isReversed.current = true;

    setInputValue(outputValue);
    setOutputValue(inputValue);
    setSrcToken(destToken);
    setDestToken(srcToken);
  }, [inputValue, outputValue, srcToken, destToken]);

  // Get swap button className
  const getSwapBtnClassName = useCallback(() => {
    let className =
      "p-6 w-full my-2 rounded-lg text-lg font-medium transition-all duration-200";

    if (swapBtnText === ENTER_AMOUNT || swapBtnText === CONNECT_WALLET) {
      className += "hidden";
    } else if (swapBtnText === INCREASE_ALLOWANCE) {
      className += " bg-yellow-600 hover:bg-yellow-700 text-white";
    } else {
      className += " bg-lime-500 hover:bg-lime-600 text-white";
    }

    if (isLoading || txPending) {
      className += " opacity-50 pointer-events-none";
    }

    return className;
  }, [swapBtnText, isLoading, txPending]);

  // Get current exchange rate
  const getExchangeRate = useCallback(() => {
    if (
      !srcToken ||
      !destToken ||
      srcToken === DEFAULT_VALUE ||
      destToken === DEFAULT_VALUE
    ) {
      return null;
    }

    try {
      if (srcToken !== ETH && destToken !== ETH) {
        // Token to token
        const srcPrice = tokenPrices[srcToken] || 1;
        const destPrice = tokenPrices[destToken] || 1;
        return (srcPrice / destPrice).toFixed(6);
      } else if (srcToken === ETH && destToken !== ETH) {
        // ETH to token
        const tokenPrice = tokenPrices[destToken] || 1;
        return (1 / tokenPrice).toFixed(6);
      } else if (srcToken !== ETH && destToken === ETH) {
        // Token to ETH
        const tokenPrice = tokenPrices[srcToken] || 1;
        return tokenPrice.toFixed(6);
      }
      return null;
    } catch (error) {
      return null;
    }
  }, [srcToken, destToken, tokenPrices]);

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

      <div className="relative bg-[#212429] p-4 py-6 rounded-xl mb-2 border-2 border-transparent hover:border-zinc-700 transition-colors">
        <SwapField obj={srcTokenObj} ref={inputValueRef} />
        <ArrowSmDownIcon
          className="absolute left-1/2 -translate-x-1/2 -bottom-6 h-10 p-1 bg-[#212429] 
            border-4 border-zinc-900 text-zinc-300 rounded-xl cursor-pointer hover:scale-110 transition-all duration-300"
          onClick={handleReverseExchange}
        />
      </div>
      {/* Exchange Rate Display */}
      {getExchangeRate() && (
        <div className="pl-2 text-sm text-zinc-300 mb-2">
          1 {srcToken} = {getExchangeRate()} {destToken}
        </div>
      )}

      <div className="bg-[#212429] p-4 py-6 rounded-xl mb-2 border-2 border-transparent hover:border-zinc-700 transition-colors">
        <SwapField obj={destTokenObj} ref={outputValueRef} />
      </div>

      <button
        className={getSwapBtnClassName()}
        onClick={handleSwapClick}
        disabled={isLoading || txPending}
      >
        {isLoading || txPending ? "Processing..." : swapBtnText}
      </button>

      {txPending && <TransactionStatus />}
    </div>
  );
};

export default SwapComponent;
