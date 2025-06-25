const hre = require("hardhat");

async function main() {
    console.log("🚀 Starting deployment to Sepolia testnet...");
    
    // Get the deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("📋 Deploying contracts with account:", deployer.address);
    console.log("💰 Account balance:", hre.ethers.utils.formatEther(await deployer.getBalance()), "ETH");

    // Deploy the EthereumDex contract
    console.log("\n📦 Deploying EthereumDex contract...");
    const EthereumDex = await hre.ethers.getContractFactory("EthereumDex");
    const ethereumDex = await EthereumDex.deploy();

    console.log("⏳ Waiting for deployment to be mined...");
    await ethereumDex.deployed();

    console.log("\n✅ EthereumDex deployed successfully!");
    console.log("📍 Contract address:", ethereumDex.address);
    console.log("🌐 Network:", hre.network.name);
    console.log("🔗 Chain ID:", hre.network.config.chainId);
    
    // Verify the deployment by checking contract state
    console.log("\n🔍 Verifying contract deployment...");
    try {
        // Check supported tokens
        const supportedTokens = await ethereumDex.getSupportedTokens();
        console.log("✅ Contract verification successful!");
        console.log("🪙 Supported tokens:", supportedTokens);
        
        // Check token prices
        for (let i = 0; i < Math.min(supportedTokens.length, 3); i++) {
            const tokenName = supportedTokens[i];
            const tokenPrice = await ethereumDex.tokenPrices(tokenName);
            console.log(`💰 ${tokenName} price: ${hre.ethers.utils.formatEther(tokenPrice)} ETH`);
        }
        
        // Check contract owner
        const owner = await ethereumDex.owner();
        console.log("👑 Contract owner:", owner);
        
        // Check if owner matches deployer
        if (owner === deployer.address) {
            console.log("✅ Owner verification successful");
        } else {
            console.log("⚠️  Owner verification failed");
        }
        
    } catch (error) {
        console.log("❌ Contract verification failed:", error.message);
    }
    
    console.log("\n📋 Deployment Summary:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Contract: EthereumDex");
    console.log("Address:", ethereumDex.address);
    console.log("Network: Sepolia Testnet");
    console.log("Deployer:", deployer.address);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    console.log("\n🎉 Deployment completed successfully!");
    console.log("💡 Next steps:");
    console.log("   1. Save the contract address for frontend integration");
    console.log("   2. Verify the contract on Etherscan (optional)");
    console.log("   3. Test the swap functions");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exitCode = 1;
    }); 