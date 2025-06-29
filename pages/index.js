import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import Wallet from "../components/Wallet";
import { useMetaMask } from "../utils/MetaMaskContext";

export default function Home() {
  const { account } = useMetaMask();

  return (
    <div className="min-h-screen bg-zinc-900">
      <Head>
        <title>MetaSwap - MetaMask Integration</title>
        <meta
          name="description"
          content="Simple MetaMask integration for token swapping"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-1 sm:px-4 pb-8 ">
        <div className="max-w-xl mx-auto">
          {!account && (
            <div className=" text-center my-8">
              <h1 className="text-5xl text-zinc-200 font-bold sm:text-6xl">
                Meta
                <span className="text-[#7765F3]">Swap</span>
              </h1>
              <p className="mt-6 mb-8 text-lg text-zinc-400 sm:mb-8">
                Connect your MetaMask wallet, swap tokens, and earn rewards.
              </p>
            </div>
          )}

          <div className="mt-2">
            <div className="border-2 border-[#7765F3] bg-gradient-to-l from-[#7765F3] to-[#4D44B5] w-full p-4 px-4 rounded-xl">
              <div className="flex flex-col lg:flex-col-reverse lg:justify-between ">
                <Wallet />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
