require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

// Sepolia RPC URL - you can use Infura, Alchemy, or other providers
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR-PROJECT-ID";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "e92d68b88b59cb37a97d83339a0d029e429368e3c0eb06021649c22e5a2686e6";

if (!process.env.PRIVATE_KEY) {
    console.log("⚠️  Warning: Using hardcoded private key. For production, use environment variables.");
}

module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 11155111,
      gasPrice: 15000000000, // 15 gwei (reduced from 20)
      gas: 5000000, // 5M gas limit
    },
  },
};
