import React from "react";
import "../styles/globals.css";
import { MetaMaskProvider } from "../utils/MetaMaskContext";

const MyApp = ({ Component, pageProps }) => {
  return (
    <MetaMaskProvider>
      <Component {...pageProps} />
    </MetaMaskProvider>
  );
};

export default MyApp;
