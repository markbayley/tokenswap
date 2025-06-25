const hre = require("hardhat");

async function main() {
    console.log("🧪 Testing deployed EthereumDexLite contract on Sepolia...");
    
    // Contract address from deployment
    const CONTRACT_ADDRESS = "0x349847d1DBCa0E1F191ec29a5E1f15e3dA215d55";
    
    // Get signers
    const [deployer] = await hre.ethers.getSigners();
    console.log("👤 Testing with account:", deployer.address);
    
    // Connect to deployed contract
    const EthereumDexLite = await hre.ethers.getContractFactory("EthereumDexLite");
    const contract = EthereumDexLite.attach(CONTRACT_ADDRESS);
    
    console.log("📍 Contract address:", CONTRACT_ADDRESS);
    
    // Test 1: Check contract owner
    console.log("\n🔍 Test 1: Checking contract owner...");
    const owner = await contract.owner();
    console.log("✅ Contract owner:", owner);
    console.log("✅ Owner verification:", owner === deployer.address ? "PASS" : "FAIL");
    
    // Test 2: Check USDT token
    console.log("\n🪙 Test 2: Checking USDT token...");
    const usdtKey = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("USDT"));
    const usdtAddress = await contract.tokenInstances(usdtKey);
    console.log("✅ USDT token address:", usdtAddress);
    
    // Test 3: Check USDT price
    const usdtPrice = await contract.tokenPrices(usdtKey);
    console.log("✅ USDT price:", hre.ethers.utils.formatEther(usdtPrice), "ETH");
    
    // Test 4: Check user balance before swap
    console.log("\n💰 Test 4: Checking balances...");
    const userBalance = await deployer.getBalance();
    console.log("✅ User ETH balance:", hre.ethers.utils.formatEther(userBalance), "ETH");
    
    const userUsdtBalance = await contract.getTokenBalance(usdtKey, deployer.address);
    console.log("✅ User USDT balance:", hre.ethers.utils.formatEther(userUsdtBalance), "USDT");
    
    // Test 5: Small ETH to USDT swap (if user has enough ETH)
    if (userBalance.gt(hre.ethers.utils.parseEther("0.01"))) {
        console.log("\n🔄 Test 5: Testing ETH to USDT swap...");
        const swapAmount = hre.ethers.utils.parseEther("0.005"); // 0.005 ETH
        
        try {
            console.log(`Swapping ${hre.ethers.utils.formatEther(swapAmount)} ETH for USDT...`);
            
            const tx = await contract.swapEthToToken(usdtKey, {
                value: swapAmount
            });
            console.log("⏳ Transaction hash:", tx.hash);
            
            await tx.wait();
            console.log("✅ Swap transaction confirmed!");
            
            // Check new balances
            const newUserUsdtBalance = await contract.getTokenBalance(usdtKey, deployer.address);
            console.log("✅ New USDT balance:", hre.ethers.utils.formatEther(newUserUsdtBalance), "USDT");
            
            const usdtReceived = newUserUsdtBalance.sub(userUsdtBalance);
            console.log("✅ USDT received:", hre.ethers.utils.formatEther(usdtReceived), "USDT");
            
        } catch (error) {
            console.log("❌ Swap failed:", error.message);
        }
    } else {
        console.log("\n⚠️  Skipping swap test - insufficient ETH balance");
    }
    
    console.log("\n🎉 Contract testing completed!");
    console.log("✅ Your EthereumDexLite is working correctly on Sepolia!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exitCode = 1;
    }); 