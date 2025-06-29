import React from "react";
import { useMetaMask } from "../utils/MetaMaskContext";

const MetaMaskConnect = ({ compact = false }) => {
  const {
    account,
    isConnecting,
    error,
    isClient,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    getCurrentNetwork,
  } = useMetaMask();

  const [currentNetwork, setCurrentNetwork] = React.useState(null);

  // Get current network on mount and when account changes
  React.useEffect(() => {
    const fetchNetwork = async () => {
      if (account && isClient) {
        const network = await getCurrentNetwork();
        setCurrentNetwork(network);
      }
    };
    fetchNetwork();
  }, [account, getCurrentNetwork, isClient]);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get network name
  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet";
      case 11155111:
        return "Sepolia Testnet";
      case 5:
        return "Goerli Testnet";
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <div
        className={`${
          compact ? "h-8 w-20" : "h-12 w-32"
        } bg-gray-300 animate-pulse rounded-lg`}
      ></div>
    );
  }

  // Compact version for header
  if (compact) {
    if (!isMetaMaskInstalled()) {
      return (
        <button
          onClick={() => window.open("https://metamask.io/download/", "_blank")}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Install MetaMask
        </button>
      );
    }

    if (error) {
      return (
        <button
          onClick={connectWallet}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      );
    }

    if (!account) {
      return (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-400 text-white pl-3 pr-6 py-2
          rounded-lg text-[16px] font-semibold transition-colors flex items-center space-x-2"
        >
          {isConnecting ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="">Connect</span>
            </>
          )}
        </button>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <div className="text-right">
          <p className="text-white text-sm font-medium">
            {formatAddress(account)}
          </p>
          {currentNetwork && (
            <p className="text-zinc-400 text-xs">
              {getNetworkName(currentNetwork.chainId)}
            </p>
          )}
        </div>
        <button
          onClick={disconnectWallet}
          className="text-zinc-400 hover:text-white text-sm transition-colors"
          title="Disconnect"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    );
  }

  // Full version for main content
  if (!isMetaMaskInstalled()) {
    return (
      <div className="flex flex-col items-center space-y-4 p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="text-red-700 font-medium">
            MetaMask Not Installed
          </span>
        </div>
        <p className="text-red-600 text-sm text-center">
          Please install MetaMask to use this application.
        </p>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-4 p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="text-red-700 font-medium">Connection Error</span>
        </div>
        <p className="text-red-600 text-sm text-center">{error}</p>
        <button
          onClick={connectWallet}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center space-y-4 bg-transparent  rounded-lg">
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-yellow-600 w-full flex justify-center hover:bg-yellow-500 disabled:bg-blue-400 text-white px-2 sm:px-6 py-2 sm:py-6 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          {isConnecting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5 hidden sm:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span>Connect MetaMask</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 py-6 bg-transparent rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg
            className="h-6 w-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-white font-medium">Connected</span>
        </div>
        <button
          onClick={disconnectWallet}
          className="text-white hover:text-green-800 text-md font-medium transition-colors pr-4"
        >
          Disconnect
        </button>
      </div>

      <div className="space-y-3">
        {currentNetwork && (
          <div className="bg-zinc-800 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Network</p>
            <p className="text-gray-200 text-sm">
              {getNetworkName(currentNetwork.chainId)}
            </p>
          </div>
        )}

        {currentNetwork && currentNetwork.chainId !== 11155111 && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <svg
                className="h-5 w-5 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="text-yellow-700 font-medium text-sm">
                Wrong Network
              </span>
            </div>
            <p className="text-yellow-600 text-sm mb-3">
              This app works best on Sepolia testnet. Please switch your
              network.
            </p>
            <button
              onClick={switchToSepolia}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Switch to Sepolia
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaMaskConnect;
