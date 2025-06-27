import React, { useState } from "react";

import { SwapComponent, Wallet } from "./index";

const HeroSection = () => {
  

  const [showWallet, setShowWallet] = useState(false);

  return (
    <section className="bg-[#1A1A1A] text-gray-100">
      <div className="container flex flex-col justify-center p-2 mx-auto sm:py-12  lg:flex-row lg:justify-evenly">
        <div className="flex flex-col justify-center p-2 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
          <h1 className="text-5xl text-zinc-200 font-bold sm:text-6xl">
            Token
            <span className="text-[#7765F3]">Swap</span>
          </h1>
          <p className="mt-6 mb-8 text-lg text-zinc-400 sm:mb-12">
            Swap, earn, and build on the leading decentralized
             exchange platform.
            <br className="hidden md:inline lg:hidden" />
            {" "} ERC20 tokens, NFTs, and more.
          </p>
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            {/* <a
              rel="noopener noreferrer"
              href="#"
                className="px-6 py-3 font-semibold rounded-md bg-[#4D44B5] text-white hover:bg-[#7765F3]"
            >
              Get Started
            </a> */}
            <a
            onClick={() => setShowWallet(false)}
              rel="noopener noreferrer"
              href="#"
                className="px-6 py-3 font-semibold rounded-md bg-[#4D44B5] text-white hover:bg-[#7765F3]"
            >
              Swap Tokens
            </a>
            <a
            onClick={() => setShowWallet(true)}
              rel="noopener noreferrer"
              href="#"
               className="px-8 py-3 font-semibold rounded-md bg-[#4D44B5] text-white hover:bg-[#7765F3]"
            >
              My Wallet
            </a>
         
          </div>
        </div>

        <div className="flex items-center justify-center p-2 mt-8 rounded-sm lg:w-1/2 lg:mt-0">
          {showWallet ? <Wallet /> : <SwapComponent />}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
