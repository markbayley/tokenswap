import React from "react";
import "../styles/globals.css";

import merge from "lodash/merge";
import "@rainbow-me/rainbowkit/styles.css";
import { sepolia } from 'wagmi/chains'
import { suppressWalletConnectErrors } from '../utils/suppressWalletConnectErrors';

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  midnightTheme,
} from "@rainbow-me/rainbowkit";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { chains, provider } = configureChains(
  [sepolia],
  [
   jsonRpcProvider({
     rpc: (chain) => {
       if (chain.id !== sepolia.id) return null;
       return {
         http: `https://sepolia.infura.io/v3/313d61c497b74eaeac16e57f2cb20b72`,
       };
     },
   })
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Custome Dex",
  projectId: "c4f79cc821944d9680842e34466bfbd9",
  chains,
});

const wagmiClient = createClient({
  autoConnect: false,
  // Suppress WalletConnect WebSocket errors in development
  connectors,
  provider,
});

const myTheme = merge(midnightTheme(), {
  colors: {
    accentColor: "#18181b",
    accentColorForeground: "#fff",
  },
});

const MyApp = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={wagmiClient}>
   
        <RainbowKitProvider chains={chains} theme={myTheme}>
          <Component {...pageProps} />
        </RainbowKitProvider>
     
    </WagmiConfig>
  );
};

export default MyApp;
