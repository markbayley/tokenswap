const hre = require("hardhat");

async function main() {
    console.log("⛽ Estimating gas costs for contract deployments...");
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("📋 Using account:", deployer.address);
    
    // Estimate gas for full EthereumDex
    console.log("\n🔍 Estimating gas for EthereumDex (Full Version)...");
    try {
        const EthereumDex = await hre.ethers.getContractFactory("EthereumDex");
        const deploymentData = EthereumDex.getDeployTransaction();
        const estimatedGas = await hre.ethers.provider.estimateGas(deploymentData);
        
        const gasPrice = hre.ethers.utils.parseUnits("15", "gwei"); // 15 gwei
        const estimatedCost = estimatedGas.mul(gasPrice);
        
        console.log(`✅ Estimated gas: ${estimatedGas.toString()}`);
        console.log(`💰 Estimated cost: ${hre.ethers.utils.formatEther(estimatedCost)} ETH`);
        console.log(`📊 Gas price used: 15 gwei`);
    } catch (error) {
        console.log("❌ Could not estimate gas for EthereumDex:", error.message);
    }
    
    // Estimate gas for EthereumDexLite
    console.log("\n🔍 Estimating gas for EthereumDexLite (Lite Version)...");
    try {
        const EthereumDexLite = await hre.ethers.getContractFactory("EthereumDexLite");
        const deploymentData = EthereumDexLite.getDeployTransaction();
        const estimatedGas = await hre.ethers.provider.estimateGas(deploymentData);
        
        const gasPrice = hre.ethers.utils.parseUnits("15", "gwei"); // 15 gwei
        const estimatedCost = estimatedGas.mul(gasPrice);
        
        console.log(`✅ Estimated gas: ${estimatedGas.toString()}`);
        console.log(`💰 Estimated cost: ${hre.ethers.utils.formatEther(estimatedCost)} ETH`);
        console.log(`📊 Gas price used: 15 gwei`);
    } catch (error) {
        console.log("❌ Could not estimate gas for EthereumDexLite:", error.message);
    }
    
    // Check current balance
    const balance = await deployer.getBalance();
    console.log(`\n💰 Current balance: ${hre.ethers.utils.formatEther(balance)} ETH`);
    
    console.log("\n💡 Recommendations:");
    console.log("   1. Use EthereumDexLite if you have < 0.1 ETH");
    console.log("   2. Use EthereumDex if you have > 0.2 ETH");
    console.log("   3. Consider waiting for more faucet ETH if needed");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Gas estimation failed:", error);
        process.exitCode = 1;
    }); 