# EthereumDex - Ethereum DEX Smart Contract

A secure, gas-optimized decentralized exchange (DEX) smart contract for swapping tokens and ETH on the Ethereum network.

## 🚀 Features

- **Secure Swaps**: ETH ↔ Token and Token ↔ Token exchanges
- **Reentrancy Protection**: Built-in security against reentrancy attacks
- **Access Control**: Owner-only admin functions
- **Fee Collection**: 0.3% swap fees for sustainability
- **Emergency Controls**: Pause/unpause functionality
- **Comprehensive Logging**: Detailed event emission for all transactions

## 📁 Project Structure

```
deploy/
├── contracts/
│   └── EthereumDex.sol        # Main DEX contract
├── scripts/
│   ├── deploy-sepolia.js      # Sepolia deployment script
│   └── test-contract.js       # Contract testing script
├── hardhat.config.js          # Hardhat configuration
├── package.json               # Dependencies and scripts
└── DEPLOYMENT_GUIDE.md        # Detailed deployment guide
```

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile Contracts
```bash
npm run compile
```

### 3. Test Locally
```bash
npm run test:local
```

### 4. Deploy to Sepolia
```bash
npm run deploy:sepolia
```

## 📋 Available Scripts

- `npm run compile` - Compile smart contracts
- `npm run deploy:sepolia` - Deploy to Sepolia testnet
- `npm run test:local` - Test contract locally
- `npm run test:contract` - Test deployed contract

## 🔧 Configuration

Set up your environment variables in a `.env` file:

```bash
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
```

## 📖 Documentation

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## 🔒 Security Features

- ReentrancyGuard protection
- Access control with Ownable
- Emergency pause functionality
- Input validation
- Safe transfer patterns

## ⚡ Gas Optimization

- Efficient data structures
- Minimal storage operations
- Optimized loops
- Batch operations

## 📞 Support

For issues or questions, please refer to the deployment guide or check the contract comments for detailed function documentation. 