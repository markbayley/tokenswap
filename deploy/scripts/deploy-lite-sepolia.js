const hre = require("hardhat");

async function main() {
    console.log("🚀 Starting deployment of EthereumDexLite to Sepolia testnet...");
    
    // Get the deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("📋 Deploying contracts with account:", deployer.address);
    console.log("💰 Account balance:", hre.ethers.utils.formatEther(await deployer.getBalance()), "ETH");

    // Deploy the EthereumDexLite contract (gas optimized)
    console.log("\n📦 Deploying EthereumDexLite contract...");
    const EthereumDexLite = await hre.ethers.getContractFactory("EthereumDexLite");
    const ethereumDexLite = await EthereumDexLite.deploy();

    console.log("⏳ Waiting for deployment to be mined...");
    await ethereumDexLite.deployed();

    console.log("\n✅ EthereumDexLite deployed successfully!");
    console.log("📍 Contract address:", ethereumDexLite.address);
    console.log("🌐 Network:", hre.network.name);
    console.log("🔗 Chain ID:", hre.network.config.chainId);
    
    // Verify the deployment
    console.log("\n🔍 Verifying contract deployment...");
    try {
        // Check contract owner
        const owner = await ethereumDexLite.owner();
        console.log("✅ Contract owner:", owner);
        
        // Check if owner matches deployer
        if (owner === deployer.address) {
            console.log("✅ Owner verification successful");
        } else {
            console.log("⚠️  Owner verification failed");
        }
        
        // Test a simple function
        const usdtKey = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("USDT"));
        const tokenAddress = await ethereumDexLite.tokenInstances(usdtKey);
        console.log("✅ USDT token address:", tokenAddress);
        
    } catch (error) {
        console.log("❌ Contract verification failed:", error.message);
    }
    
    console.log("\n📋 Deployment Summary:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Contract: EthereumDexLite (Gas Optimized)");
    console.log("Address:", ethereumDexLite.address);
    console.log("Network: Sepolia Testnet");
    console.log("Deployer:", deployer.address);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    console.log("\n🎉 Deployment completed successfully!");
    console.log("💡 Next steps:");
    console.log("   1. Save the contract address for frontend integration");
    console.log("   2. Test the swap functions with small amounts");
    console.log("   3. Consider upgrading to full version when you have more ETH");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exitCode = 1;
    }); 