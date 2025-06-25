# EthereumDexLite - Deployed Contract Information

## 📋 Contract Details

**Contract Name:** EthereumDexLite  
**Contract Address:** `0x349847d1DBCa0E1F191ec29a5E1f15e3dA215d55`  
**Network:** Sepolia Testnet  
**Chain ID:** 11155111  
**Deployer:** `0xC57DeA6Ef52441B16123e16f51E1d66728445725`  
**Deployment Date:** December 2024  

## 🔗 Block Explorer Links

- **Etherscan:** https://sepolia.etherscan.io/address/0x349847d1DBCa0E1F191ec29a5E1f15e3dA215d55
- **Contract Code:** https://sepolia.etherscan.io/address/0x349847d1DBCa0E1F191ec29a5E1f15e3dA215d55#code

## 🪙 Supported Tokens

| Token | Key | Address | Price (ETH) |
|-------|-----|---------|-------------|
| USDT | `0x2acf35c9a3f4c5c3f4b60244d1377ada9597e984c4e89b0c2e4fcc31b2e9c5b3` | `0xC8096233753e162C0081D16C2d32B69E5D08606B` | 0.0005 |
| USDC | `0x9aa698f7c69e3b4cf2e8176e723693841b9e0e1a3e9b5a0e1a3e9b5a0e1a3e9b` | `0x...` | 0.0005 |

## 🔧 Available Functions

### Swap Functions
- `swapEthToToken(bytes32 tokenName)` - Swap ETH for tokens
- `swapTokenToEth(bytes32 tokenName, uint256 amount)` - Swap tokens for ETH

### View Functions
- `getTokenBalance(bytes32 tokenName, address userAddress)` - Get user's token balance
- `tokenInstances(bytes32 tokenName)` - Get token contract address
- `tokenPrices(bytes32 tokenName)` - Get token price in ETH

### Admin Functions
- `withdrawFees()` - Withdraw collected fees (owner only)
- `owner()` - Get contract owner

## 💰 Fee Structure

- **Swap Fee:** 0.3% (30 basis points)
- **Minimum ETH Amount:** 0.001 ETH
- **Minimum Token Amount:** 1 token (with 18 decimals)

## 🧪 Testing Commands

```bash
# Test the deployed contract
npm run test:deployed

# Estimate gas costs
npm run estimate:gas

# Deploy lite version
npm run deploy:lite-sepolia
```

## 📊 Gas Usage

- **Deployment Gas:** ~2.2M gas
- **Deployment Cost:** ~0.033 ETH (at 15 gwei)
- **Swap Gas:** ~50K-100K gas per transaction

## 🔄 Usage Examples

### ETH to USDT Swap
```javascript
const usdtKey = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("USDT"));
const swapAmount = ethers.utils.parseEther("0.01"); // 0.01 ETH

await contract.swapEthToToken(usdtKey, {
    value: swapAmount
});
```

### Check USDT Balance
```javascript
const usdtKey = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("USDT"));
const balance = await contract.getTokenBalance(usdtKey, userAddress);
```

## 🚀 Next Steps

1. **Test the contract** with small amounts
2. **Integrate with frontend** using the contract address
3. **Monitor transactions** on Etherscan
4. **Consider upgrading** to full version when you have more ETH

## ⚠️ Important Notes

- This is a **testnet deployment** - not for production use
- **Gas optimized** version with reduced functionality
- **Owner controls** fee withdrawal
- **0.3% fee** on all swaps
- **Minimum amounts** apply to prevent dust attacks 