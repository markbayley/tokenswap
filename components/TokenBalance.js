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

const TokenBalance = ({ name, walletAddress }) => {
  const [balance, setBalance] = useState(0);
  const [tokenAddress, setTokenAddress] = useState("");

  const [copyIcon, setCopyIcon] = useState(ClipboardCopyIcon);

  const [txPending, setTxPending] = useState(false);

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
    });
  };

  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
    });
  };

  useEffect(() => {
    if (name && walletAddress) {
      fetchTokenBalance();
      fetchTokenAddress();
    } else {
      setBalance(0);
      setTokenAddress("");
    }
  }, [name, walletAddress]);

  async function fetchTokenBalance() {
    try {
      const balance = await getTokenBalance(name, walletAddress);
      console.log(balance);
      const fetchBalance = ethers.utils.formatUnits(balance.toString());
      setBalance(fetchBalance);
    } catch (error) {
      console.error("Error fetching token balance:", error);
      setBalance(0);
    }
  }

  async function fetchTokenAddress() {
    try {
      const address = await getTokenAddress(name);
      setTokenAddress(address);
    } catch (error) {
      console.error("Error fetching token address:", error);
      setTokenAddress("");
    }
  }

  return (
    <div className="flex mx-2 border-[1px] rounded-r-md border-[#7765F3]">
      <div className="flex items-center bg-zinc-900 text-zinc-300 w-fit px-3 rounded-l-md">
        <p className="text-sm">{name}</p>
        <p className="bg-zinc-800 p-0.5 px-3 ml-3 rounded-md text-zinc-100">
          {walletAddress ? balance : "-"}
        </p>
      </div>

      {tokenAddress && (
        <div className="flex items-center px-1 bg-[#7765F3] rounded-r-md">
          <DocumentDuplicateIcon
            className="h-5 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(tokenAddress);
              setCopyIcon(ClipboardCheckIcon);
              notifySuccess("Copied to clipboard");
            }}
          />
        </div>
      )}
      {txPending && (
        <div className="flex items-center p-2 px-3 bg-[#7765F3] rounded-r-md">
          <TransactionStatus />
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default TokenBalance;
