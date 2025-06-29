# Custom Token Swap Marketplace (Uniswap Exchange) DApp

Building a Custom Token Swap Marketplace (Uniswap Exchange) using Next.js, Solidity, and React.js Build your Uniswap Token Marketplace start-up, in which you can provide users to Swap any ERC20 token, and allow them to buy tokens.

## Project Overview

![alt text](https://www.daulathussain.com/wp-content/uploads/2023/08/uniswap-token-marketplace.jpg)

## Instruction

Kindly follow the following Instructions to run the project in your system and install the necessary requirements

- [Final Source Code](https://www.theblockchaincoders.com/sourceCode/uniswap-token-marketplace-dapp)

#### Setup Video

- [Final Code Setup video](https://youtu.be/2gqvaEAVCM4?si=b_XykDWVP1hzCBkY)

```
   URL: https://youtu.be/2gqvaEAVCM4?si=b_XykDWVP1hzCBkY
   WATCH: Setup & Demo Of Project
```

#### Install Vs Code Editor

```
  URL: https://code.visualstudio.com/download
  GET: VsCode Editor
```

#### NodeJs & NPM Version

```
  URL: https://nodejs.org/en/download
  NodeJs: v18.12.1
  NPM: 8.19.2
```

#### Clone Starter File

```
  URL:https://github.com/daulathussain/uniswap-tokem-marketplace-starter-file
  GET: Project Starter File Download
```

All you need to follow the complete project and follow the instructions which are explained in the tutorial by Daulat

## Final Code Instruction

If you download the final source code then you can follow the following instructions to run the Dapp successfully

#### Setup Video

```
   URL: https://youtu.be/UHjJwa8TiQs?si=EzdPof1eUA37Nhtt
   WATCH: Setup & Demo Of Project
```

#### Final Source Code

```
   FINAL SOURCE CODE: https://www.theblockchaincoders.com/sourceCode/uniswap-token-marketplace-dapp
   ALL SOURCE CODE: https://www.theblockchaincoders.com/SourceCode
   Download the Final Source Code
```

#### Install Vs Code Editor

```
  URL: https://code.visualstudio.com/download
  GET: VsCode Editor
```

#### NodeJs & NPM Version

```
  URL: https://nodejs.org/en/download
  NodeJs: v18.12.1
  NPM: 8.19.2
```

#### WAGMI WALLET

```
  URL CHAINS: https://wagmi.sh/react/api/chains
  WEBSITE: https://wagmi.sh/
  DOC: https://wagmi.sh/react/getting-started
```

#### Test Faucets

Google will provide you with some free test faucets which you can transfer to your wallet address for deploying the contract

```
  URL: https://cloud.google.com/application/web3/faucet
  Get: Free Test Faucets
```

#### RemixID

We are using RemixID for deploying the contract and generation of the ABI in the project, but you can use any other tools like Hardhat, etc.

```
  URL: https://remix-project.org
  OPEN: RemixID
```

## Important Links

- [Get Pro Blockchain Developer Course](https://www.theblockchaincoders.com/pro-nft-marketplace)
- [Support Creator](https://bit.ly/Support-Creator)
- [All Projects Source Code](https://www.theblockchaincoders.com/SourceCode)

## Authors

- [@theblockchaincoders.com](https://www.theblockchaincoders.com/)
- [@consultancy](https://www.theblockchaincoders.com/consultancy)
- [@youtube](https://www.youtube.com/@daulathussain)

#### ENVIROMENT VARIABLES

```
  NEXT_PUBLIC_MARKETPLACE_ADDRESS = 0xd55fffb30a6af39A6705e52d172eAf77baC73aA2

  # SEPOLIA RPC URL
  NEXT_PUBLIC_SEPOLIA_URL = https://rpc.ankr.com/eth_sepolia

  # HOLESKY RPC URL
  NEXT_PUBLIC_HOLESKY_RPC_URL = https://rpc.ankr.com/eth_holesky
```

#### HOLESKY NETWORK

```
  const { chains, provider } = configureChains(
  [
    {
      id: 17000,
      name: "Holesky",
      network: "holesky",
      nativeCurrency: {
        name: "Holesky Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: [`${HOLESKY}`],
        },
        public: {
          http: [`${HOLESKY}`],
        },
      },
      blockExplorers: {
        default: {
          name: "Holescan",
          url: "https://holesky.etherscan.io/",
        },
      },
      testnet: true,
    },
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === 17000) {
          return { http: `${HOLESKY}` };
        }
        return null;
      },
      priority: 1,
    }),
  ]
);
```

#### SEPOLIA NETWORK

```
 const { chains, provider } = configureChains(
  [
    {
      id: 11155111,
      name: "Sepolia",
      network: "sepolia",
      nativeCurrency: {
        name: "Sepolia Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: [`${SEPOLIA}`],
        },
        public: {
          http: [`${SEPOLIA}`],
        },
      },
      blockExplorers: {
        default: {
          name: "Etherscan",
          url: "https://sepolia.etherscan.io",
        },
      },
      testnet: true,
    },
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === 11155111) {
          return { http: `${SEPOLIA}` };
        }
        return null;
      },
      priority: 1,
    }),
  ]
);
```

# TokenSwap - MetaMask Integration

A simple token swapping application with direct MetaMask integration, without using wagmi or rainbowkit.

## Features

- **Direct MetaMask Integration**: Connects directly to MetaMask without external wallet libraries
- **Wallet Connection**: Simple connect/disconnect functionality with network detection
- **Token Swapping**: Swap between ETH, USDT, and USDC tokens
- **Balance Display**: View token balances in a clean wallet interface
- **Network Support**: Optimized for Sepolia testnet with automatic network switching
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MetaMask](https://metamask.io/) browser extension
- Sepolia testnet ETH for testing

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tokenswap
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Connecting MetaMask

1. Make sure you have MetaMask installed in your browser
2. Click the "Connect" button in the header
3. Approve the connection in MetaMask
4. Switch to Sepolia testnet if prompted

### Viewing Balances

- The wallet component displays your ETH, USDT, and USDC balances
- Balances are automatically updated when you connect
- Click the refresh button to manually update balances

### Swapping Tokens

1. Select the token you want to swap from (source token)
2. Select the token you want to swap to (destination token)
3. Enter the amount you want to swap
4. Click "Swap" to execute the transaction
5. Approve the transaction in MetaMask

## Architecture

### Key Components

- **MetaMaskContext** (`utils/MetaMaskContext.js`): Manages wallet connection state and provides wallet functionality
- **MetaMaskConnect** (`components/MetaMaskConnect.js`): UI component for connecting/disconnecting wallets
- **Wallet** (`components/Wallet.js`): Displays token balances and wallet information
- **SwapComponent** (`components/SwapComponent.js`): Handles token swapping functionality

### MetaMask Integration

The application uses a custom MetaMask context that provides:

- Wallet connection/disconnection
- Account and network detection
- Automatic network switching
- Error handling
- Event listeners for account and network changes

### Benefits of Direct Integration

- **Reduced Bundle Size**: No external wallet libraries
- **Simpler Dependencies**: Only requires ethers.js
- **Better Control**: Direct access to MetaMask APIs
- **Customizable UI**: Full control over the user interface
- **Easier Debugging**: Clearer error messages and state management

## Configuration

### Networks

The application is configured for Sepolia testnet by default. To change networks:

1. Update the chain ID in `MetaMaskContext.js`
2. Update the RPC URL in the network configuration
3. Update the block explorer URL

### Token Addresses

Token addresses are defined in `utils/saleToken.js`. Update these for different networks or tokens.

## Troubleshooting

### Common Issues

1. **MetaMask Not Installed**: The app will show an "Install MetaMask" button
2. **Wrong Network**: The app will prompt you to switch to Sepolia testnet
3. **Connection Failed**: Try refreshing the page and reconnecting
4. **Transaction Failed**: Check your balance and gas fees

### Development

- The app uses Next.js for the frontend
- Ethers.js for blockchain interactions
- Tailwind CSS for styling
- React Hot Toast for notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
