import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { toast, Toaster } from "react-hot-toast";

import { Menu, Logo, LogoSmall, TokenBalance, TransactionStatus } from "./index";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

const Header = () => {
  const [tokenBalComp, setTokenBalComp] = useState();
  const [isMounted, setIsMounted] = useState(false);

  const { address } = useAccount();

  const notifyConnectWallet = () => {
    toast.error("Connect Wallet", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
    });
  };

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !isClient) return;

    setTokenBalComp(
      <>
        <TokenBalance name="ETH" walletAddress={address} />
        <TokenBalance name="USDT" walletAddress={address} />
        <TokenBalance name="USDC" walletAddress={address} />
      </>
    );

    if (!address) {
     // notifyConnectWallet();
    }
  }, [address, isMounted]);

  return (
    <header className="p-4 text-zinc-100 text-lg">
      <div className="container mx-auto flex items-center justify-between h-10 ">
        {/* <Menu /> */}
        {/* {tokenBalComp} */}

        <a
          rel="noopener noreferrer"
          href="#"
          aria-label="Home"
          //target="_blank"
          className="flex items-center p-2 mt-1"
        >
          {/* Large logo for md and up, max width 150px */}
          <span className="hidden md:block">
            <span className="max-w-[150px] block">
              <Logo width="150" height="30" />
            </span>
          </span>
          {/* Small logo for below md */}
          <span className="block md:hidden">
            <LogoSmall />
          </span>
        </a>
        <ul className="items-stretch hidden space-x-3 xl:flex">
          <li>
            <a
              rel="noopener noreferrer"
              href="/"
              className="flex items-center px-4 -mb-1 text-gray-100 hover:text-[#7765F3]"
            >
              Swap
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              href="/"
              className="flex items-center px-4 -mb-1 text-gray-100 hover:text-[#7765F3]"
            >
              Wallet
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              href="/"
              className="flex items-center px-4 -mb-1 text-gray-100 hover:text-[#7765F3]"
            >
              About
            </a>
          </li>
          {/* <li>
            <a
              rel="noopener noreferrer"
              href="/"
              className="flex items-center px-4 -mb-1 text-gray-100 hover:text-[#7765F3]"
            >
              Pool
            </a>
          </li> */}
        </ul>

        <div className="flex items-center lg:space-x-2">
     
          <ConnectButton />
        </div>

        <button className="lg:hidden flex items-center p-2">
        <Menu />
      </button>
      </div>
  
      <Toaster />


      {/* <div className="container mx-auto flex items-center justify-end h-10 space-x-3">
      {isMounted && (
            <>
              <TokenBalance name="ETH" walletAddress={address} />
              <TokenBalance name="USDT" walletAddress={address} />
              <TokenBalance name="USDC" walletAddress={address} />
            </>
          )}
    </div> */}




    </header>
  );
};

export default Header;
