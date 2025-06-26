import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  hasValidBalance,
  swapEthToToken,
  swapTokenToEth,
  swapTokenToToken,
  increaseAllowance,
  getTokenBalance,
} from "../utils/context";

import { CogIcon, ArrowSmDownIcon } from "@heroicons/react/outline";
import SwapField from "./SwapField";
import TransactionStatus from "./TransactionStatus";
import LoadingSpinner from "./LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";
import { DEFAULT_VALUE, ETH } from "../utils/saleToken";
import { toEth, toWei } from "../utils/utils";
import { useAccount } from "wagmi";

// Constants
const INCREASE_ALLOWANCE = "Increase Allowance";
const ENTER_AMOUNT = "Enter Amount";
const CONNECT_WALLET = "Connect Wallet";
const SWAP = "Swap";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

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

  // Refs
  const inputValueRef = useRef();
  const outputValueRef = useRef();
  const isReversed = useRef(false);

  // Wagmi hooks
  const { address } = useAccount();

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoized token objects to prevent unnecessary re-renders
  const srcTokenObj = useMemo(() => ({
    id: "srcToken",
    value: inputValue,
    setValue: setInputValue,
    defaultValue: srcToken,
    ignoreValue: destToken,
    setToken: setSrcToken,
  }), [inputValue, srcToken, destToken]);

  const destTokenObj = useMemo(() => ({
    id: "destToken",
    value: outputValue,
    setValue: setOutputValue,
    defaultValue: destToken,
    ignoreValue: srcToken,
    setToken: setDestToken,
  }), [outputValue, destToken, srcToken]);

  // Toast notifications
  const notifyError = useCallback((msg) => toast.error(msg, { duration: 5000 }), []);
  const notifySuccess = useCallback((msg) => toast.success(msg, { duration: 5000 }), []);

  // Update swap button text based on conditions
  useEffect(() => {
    if (!isMounted) return;

    if (!address) {
      setSwapBtnText(CONNECT_WALLET);
    } else if (!inputValue || !outputValue || parseFloat(inputValue) <= 0) {
      setSwapBtnText(ENTER_AMOUNT);
    } else {
      setSwapBtnText(SWAP);
    }
  }, [inputValue, outputValue, address, isMounted]);

  // Handle input value changes and populate output
  useEffect(() => {
    if (!isMounted) return;

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
  }, [inputValue, destToken, isMounted]);

  // Handle output value changes and populate input
  useEffect(() => {
    if (!isMounted) return;

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
  }, [outputValue, srcToken, isMounted]);

  // Calculate output value based on input and tokens
  const populateOutputValue = useCallback((value) => {
    if (
      destToken === DEFAULT_VALUE ||
      srcToken === DEFAULT_VALUE ||
      !value ||
      parseFloat(value) <= 0
    ) {
      return;
    }

    try {
      if (srcToken !== ETH && destToken !== ETH) {
        // Token to token swap - simple 1:1 for now
        setOutputValue(value);
      } else if (srcToken === ETH && destToken !== ETH) {
        // ETH to token - apply conversion rate
        const outValue = toEth(toWei(value, 18));
        setOutputValue(outValue);
      } else if (srcToken !== ETH && destToken === ETH) {
        // Token to ETH - apply conversion rate
        const outValue = toEth(toWei(value, 18));
        setOutputValue(outValue);
      }
    } catch (error) {
      console.error("Error calculating output value:", error);
      setOutputValue("0");
      notifyError("Invalid input value");
    }
  }, [destToken, srcToken, notifyError]);

  // Calculate input value based on output and tokens
  const populateInputValue = useCallback((value) => {
    if (
      srcToken === DEFAULT_VALUE ||
      destToken === DEFAULT_VALUE ||
      !value ||
      parseFloat(value) <= 0
    ) {
      return;
    }

    try {
      if (srcToken !== ETH && destToken !== ETH) {
        // Token to token swap - simple 1:1 for now
        setInputValue(value);
      } else if (srcToken === ETH && destToken !== ETH) {
        // ETH to token - apply conversion rate
        const inValue = toEth(toWei(value, 18));
        setInputValue(inValue);
      } else if (srcToken !== ETH && destToken === ETH) {
        // Token to ETH - apply conversion rate
        const inValue = toEth(toWei(value, 18));
        setInputValue(inValue);
      }
    } catch (error) {
      console.error("Error calculating input value:", error);
      setInputValue("0");
      notifyError("Invalid input value");
    }
  }, [srcToken, destToken, notifyError]);

  // Handle swap button click
  const handleSwapClick = useCallback(async () => {
    if (!isClient) return;

    if (swapBtnText === INCREASE_ALLOWANCE) {
      await handleIncreaseAllowance();
    } else if (swapBtnText === SWAP) {
      await handleSwap();
    }
  }, [swapBtnText]);

  // Handle swap execution
  const handleSwap = useCallback(async () => {
    if (!isClient) return;

    if (!address) {
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
        const result = await hasValidBalance(address, srcToken, inputValue);
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
  }, [address, inputValue, outputValue, srcToken, destToken, notifyError]);

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
  }, [srcToken, inputValue, notifyError, notifySuccess]);

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
  }, [srcToken, destToken, inputValue, notifyError, notifySuccess]);

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
    let className = "p-4 w-full my-2 rounded-xl font-medium transition-all duration-200";
    
    if (swapBtnText === ENTER_AMOUNT || swapBtnText === CONNECT_WALLET) {
      className += " text-zinc-400 bg-zinc-800 pointer-events-none";
    } else if (swapBtnText === INCREASE_ALLOWANCE) {
      className += " bg-yellow-600 hover:bg-yellow-700 text-white";
    } else {
      className += " bg-green-700 hover:bg-green-800 text-white";
    }
    
    if (isLoading || txPending) {
      className += " opacity-50 pointer-events-none";
    }
    
    return className;
  }, [swapBtnText, isLoading, txPending]);

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

  return (
    <div className="border border-[#7765F3] bg-gradient-to-r from-[#7765F3] to-[#4D44B5] w-full max-w-xl p-4 px-6 rounded-xl">
      <div className="flex items-center justify-between py-4 px-1">
        <p className="text-white font-semibold text-xl">Swap Token</p>
        <CogIcon className="h-7 text-white cursor-pointer hover:text-gray-300 transition-colors" />
      </div>
      
      <div className="relative bg-[#212429] p-4 py-6 rounded-xl mb-2 border-2 border-transparent hover:border-zinc-700 transition-colors">
        <SwapField obj={srcTokenObj} ref={inputValueRef} />
        <ArrowSmDownIcon
          className="absolute left-1/2 -translate-x-1/2 -bottom-6 h-10 p-1 bg-[#212429] 
            border-4 border-zinc-900 text-zinc-300 rounded-xl cursor-pointer hover:scale-110 transition-all duration-300"
          onClick={handleReverseExchange}
        />
      </div>

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
      <Toaster />
    </div>
  );
};

export default SwapComponent;
