import React, { useState, useEffect } from "react";
import { useMetaMask } from "../utils/MetaMaskContext";
import MetaMaskConnect from "./MetaMaskConnect";

import {
  Menu,
  LogoSmall,
  TokenBalance,
} from "./index";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

const Header = () => {
  const [tokenBalComp, setTokenBalComp] = useState();
  const [isMounted, setIsMounted] = useState(false);

  const { account } = useMetaMask();

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !isClient) return;

    setTokenBalComp(
      <>
        <TokenBalance name="ETH" walletAddress={account} />
        <TokenBalance name="USDT" walletAddress={account} />
        <TokenBalance name="USDC" walletAddress={account} />
      </>
    );

    if (!account) {
      // notifyConnectWallet();
    }
  }, [account, isMounted]);

  return (
    <header className="p-4 text-zinc-100 text-lg">
      <div className="container mx-auto flex items-center justify-between h-10 ">
        <a
          rel="noopener noreferrer"
          href="#"
          aria-label="Home"
          //target="_blank"
          className="flex items-center p-2 mt-1"
        >
          <span className="flex items-center justify-center">
            <LogoSmall width="30" height="30" />
            <h1 className="hidden md:block text-xl text-zinc-200 font-bold sm:text-2xl pl-2">
              Meta
              <span className="text-[#7765F3]">Swap</span>
            </h1>
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
        </ul>

        <div className="flex items-center lg:space-x-2">
          <MetaMaskConnect compact={true} />
        </div>

        <button className="lg:hidden flex items-center p-2">
          <Menu />
        </button>
      </div>
    </header>
  );
};

export default Header;
