import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast, Toaster } from "react-hot-toast";
import {
  ClipboardCopyIcon,
  ClipboardCheckIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/outline";

import { TransactionStatus } from "./index";
import {
  getTokenAddress,
  getTokenBalance,
  increaseAllowance,
} from "../utils/context";
import { SUPPORTED_TOKENS, ETH } from "../utils/saleToken";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

const TokenBalance = ({ name, walletAddress }) => {
  const [balance, setBalance] = useState(0);
  const [tokenAddress, setTokenAddress] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [copyIcon, setCopyIcon] = useState(ClipboardCopyIcon);
  const [txPending, setTxPending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
    });
  };

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !isClient) return;

    if (name && walletAddress) {
      // Check if token is supported by the contract
      const isTokenSupported = name === ETH || SUPPORTED_TOKENS.includes(name);
      setIsSupported(isTokenSupported);

      if (isTokenSupported) {
        fetchTokenBalance();
        fetchTokenAddress();
      } else {
        // Token not supported by contract
        setBalance(0);
        setTokenAddress("");
      }
    } else {
      setBalance(0);
      setTokenAddress("");
      setIsSupported(true);
    }
  }, [name, walletAddress, isMounted]);

  async function fetchTokenBalance() {
    if (!isClient) return;

    try {
      if (name === ETH) {
        // For ETH, we need to get the wallet's ETH balance differently
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(walletAddress);
        const fetchBalance = ethers.utils.formatEther(balance);
        setBalance(fetchBalance);
      } else {
        const balance = await getTokenBalance(name, walletAddress);
        const fetchBalance = ethers.utils.formatUnits(balance.toString(), 18);
        setBalance(fetchBalance);
      }
    } catch (error) {
      console.error("Error fetching token balance:", error);
      setBalance(0);
      if (error.message && error.message.includes("Token not supported")) {
        setIsSupported(false);
      }
    }
  }

  async function fetchTokenAddress() {
    if (!isClient) return;

    try {
      if (name === ETH) {
        // ETH doesn't have a token address
        setTokenAddress("");
        return;
      }

      const address = await getTokenAddress(name);
      setTokenAddress(address);
    } catch (error) {
      console.error("Error fetching token address:", error);
      setTokenAddress("");
      if (error.message && error.message.includes("Token not supported")) {
        setIsSupported(false);
      }
    }
  }

  const handleCopyAddress = () => {
    if (tokenAddress && isClient) {
      navigator.clipboard.writeText(tokenAddress);
      setCopyIcon(ClipboardCheckIcon);
      notifySuccess("Token address copied to clipboard");

      // Reset icon after 2 seconds
      setTimeout(() => {
        setCopyIcon(ClipboardCopyIcon);
      }, 2000);
    }
  };

  // Don't render if token is not supported or not mounted
  if (!isMounted || !isSupported) {
    return null;
  }

  return (
    <div className="hidden lg:flex  border-[2px] rounded-r-md border-[#4D44B5]">
      <div className="flex items-center bg-zinc-900 text-zinc-300 w-fit pl-3 py-0.5 rounded-md">
        <p className="text-md min-w-[50px]">{name}</p>
        <p className="bg-zinc-800 p-0.5 px-3 ml-3 text-zinc-100">
          {walletAddress ? parseFloat(balance).toFixed(4) : "-"}
        </p>
      </div>

      {tokenAddress && (
        <div className="flex items-center px-1 bg-[#4D44B5] rounded-r-md">
          <DocumentDuplicateIcon
            className="h-6 cursor-pointer text-white hover:text-gray-300 transition-colors"
            onClick={handleCopyAddress}
          />
        </div>
      )}

      {txPending && (
        <div className="flex items-center p-2 px-3 bg-[#7765F3] rounded-r-md">
          <TransactionStatus />
        </div>
      )}
    </div>
  );
};

export default TokenBalance;
