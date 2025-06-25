import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { toast, Toaster } from "react-hot-toast";

import { Menu, Logo, TokenBalance, TransactionStatus } from "./index";

const Header = () => {
  const [tokenBalComp, setTokenBalComp] = useState();

  const { address } = useAccount();

  const notifyConnectWallet = () => {
    toast.error("Connect Wallet", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
    });
  };

  useEffect(() => {
    setTokenBalComp(
      <>
        <TokenBalance name="ETH" walletAddress={address} />
        <TokenBalance name="USDT" walletAddress={address} />
        <TokenBalance name="USDC" walletAddress={address} />
      </>
    );

    if (!address) {
      notifyConnectWallet();
    }
  }, [address]);

  return (
    <header className="p-4 text-gray-100">
      <div className="container mx-auto flex items-center justify-between h-16 ">
        {/* <Menu /> */}
        {/* {tokenBalComp} */}

        <a
          rel="noopener noreferrer"
          href="#"
          aria-label="Home"
          //target="_blank"
          className="flex items-center p-2"
        >
          <Logo />
        </a>
        <ul className="items-stretch hidden space-x-3 lg:flex">
          <li>
            <a
              rel="noopener noreferrer"
              href="/"
              className="flex items-center px-4 -mb-1 text-gray-100"
            >
             Swap
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              href="/"
              className="flex items-center px-4 -mb-1 dark:border-transparent text-[#7765F3] hover:text-[#7765F3] dark:hover:text-[#7765F3] border-b-2 border-transparent hover:border-[#7765F3] dark:hover:border-[#7765F3]"
            >
             Tokens
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              href="/"
              className="flex items-center px-4 -mb-1 dark:border-transparent text-[#7765F3] hover:text-[#7765F3] dark:hover:text-[#7765F3] border-b-2 border-transparent hover:border-[#7765F3] dark:hover:border-[#7765F3]"
            >
             NFTS
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              href="/"
              className="flex items-center px-4 -mb-1 dark:border-transparent text-[#7765F3] hover:text-[#7765F3] dark:hover:text-[#7765F3] border-b-2 border-transparent hover:border-[#7765F3] dark:hover:border-[#7765F3]"
            >
             Pool
            </a>
          </li>
        </ul>
     

      <div className="items-center flex-shrink-0 hidden lg:flex">
        <TokenBalance name="ETH" walletAddress={address} />
        <TokenBalance name="USDT" walletAddress={address} />
        <TokenBalance name="USDC" walletAddress={address} />
        <ConnectButton />
      </div>

      <button className="lg:hidden flex items-center p-2">
        <Menu />
      </button>
      </div>
      <Toaster />
    </header>
  );
};

export default Header;
