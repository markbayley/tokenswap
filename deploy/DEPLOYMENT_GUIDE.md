# Sepolia Testnet Deployment Guide

## Overview

This project contains an improved **EthereumDex** smart contract - a decentralized exchange for swapping tokens and ETH on the Ethereum network. The contract has been optimized for security, gas efficiency, and Ethereum-specific features.

## Key Improvements

### 🔒 Security Features
- **Reentrancy Protection**: Uses OpenZeppelin's ReentrancyGuard
- **Access Control**: Owner-only functions for admin operations
- **Pausable**: Emergency pause functionality
- **Input Validation**: Comprehensive parameter validation

### ⚡ Gas Optimization
- **Efficient Data Structures**: Optimized mappings and arrays
- **Minimal Storage**: Reduced storage operations
- **Batch Operations**: Efficient token management

### 🎯 Ethereum-Specific Features
- **Native ETH Support**: Direct ETH swaps without wrapping
- **Realistic Pricing**: Dynamic token pricing system
- **Fee Collection**: 0.3% swap fees for sustainability
- **Event Logging**: Comprehensive event emission

## Prerequisites

1. **Sepolia ETH**: Get testnet ETH from a faucet:
   - [Sepolia Faucet](https://sepoliafaucet.com/)
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

2. **RPC Provider**: Choose one:
   - [Infura](https://infura.io/) (Free tier available)
   - [Alchemy](https://alchemy.com/) (Free tier available)
   - [Ankr](https://ankr.com/) (Free tier available)

## Configuration

### 1. Set up Environment Variables

Create a `.env` file in the `deploy` directory:

```bash
# Your private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Sepolia RPC URL
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
```

### 2. Update Hardhat Config

Update `hardhat.config.js` with your actual RPC URL:

```javascript
const SEPOLIA_RPC_URL = "https://sepolia.infura.io/v3/YOUR-ACTUAL-PROJECT-ID";
```

## Deployment Steps

### 1. Install Dependencies

```bash
cd deploy
npm install
```

### 2. Compile Contracts

```bash
npm run compile
```

### 3. Test Locally (Optional)

```bash
npm run test:local
```

### 4. Deploy to Sepolia

```bash
npm run deploy:sepolia
```

### 5. Verify Contract (Optional)

After deployment, you can verify your contract on Etherscan:

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## Contract Features

### 🔄 Swap Functions
- **ETH → Token**: Swap ETH for any supported token
- **Token → ETH**: Swap tokens for ETH
- **Token → Token**: Swap between different tokens

### 📊 Management Functions
- **Add Token**: Add new tokens to the DEX
- **Update Price**: Update token prices
- **Withdraw Fees**: Collect accumulated fees
- **Pause/Unpause**: Emergency controls

### 📈 View Functions
- **Get Balances**: Check user and contract balances
- **Get Prices**: View current token prices
- **Get History**: View all swap transactions
- **Get Supported Tokens**: List all available tokens

## Network Information

- **Network Name**: Sepolia
- **Chain ID**: 11155111
- **Currency**: Sepolia ETH
- **Block Explorer**: https://sepolia.etherscan.io/

## Testing

### Local Testing
```bash
npm run test:local
```

### Contract Testing
```bash
npm run test:contract
```

## Troubleshooting

### Common Issues

1. **Insufficient Balance**: Make sure you have Sepolia ETH in your wallet
2. **RPC Error**: Check your RPC URL and ensure it's correct
3. **Gas Issues**: Sepolia can have high gas fees during peak times
4. **Token Approval**: Remember to approve tokens before swapping

### Getting Sepolia ETH

1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Connect your wallet
3. Request testnet ETH
4. Wait for confirmation (usually 1-2 minutes)

## Contract Addresses

After successful deployment, save your contract address for future reference:

- **EthereumDex Contract**: `0x...` (will be displayed after deployment)
- **Network**: Sepolia Testnet
- **Deployer**: Your wallet address

## Security Notes

- The contract includes reentrancy protection
- All admin functions are restricted to the owner
- Emergency pause functionality is available
- Fee collection is transparent and auditable
- All swaps are logged with comprehensive events

## Gas Optimization

- Efficient storage patterns
- Minimal external calls
- Optimized loops and data structures
- Batch operations where possible 