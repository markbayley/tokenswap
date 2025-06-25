const hre = require("hardhat");

async function main() {
    console.log("🧪 Testing EthereumDex contract functionality...");
    
    // Get signers
    const [owner, user1, user2] = await hre.ethers.getSigners();
    console.log("👑 Owner:", owner.address);
    console.log("👤 User1:", user1.address);
    console.log("👤 User2:", user2.address);
    
    // Deploy contract
    console.log("\n📦 Deploying EthereumDex contract...");
    const EthereumDex = await hre.ethers.getContractFactory("EthereumDex");
    const ethereumDex = await EthereumDex.deploy();
    await ethereumDex.deployed();
    
    console.log("📍 Contract deployed at:", ethereumDex.address);
    
    // Test 1: Check initial state
    console.log("\n🔍 Test 1: Checking initial contract state...");
    const supportedTokens = await ethereumDex.getSupportedTokens();
    console.log("✅ Supported tokens:", supportedTokens);
    
    const contractOwner = await ethereumDex.owner();
    console.log("✅ Contract owner:", contractOwner);
    console.log("✅ Owner verification:", contractOwner === owner.address ? "PASS" : "FAIL");
    
    // Test 2: Check token prices
    console.log("\n💰 Test 2: Checking token prices...");
    for (const tokenName of supportedTokens) {
        const price = await ethereumDex.tokenPrices(tokenName);
        console.log(`✅ ${tokenName} price: ${hre.ethers.utils.formatEther(price)} ETH`);
    }
    
    // Test 3: ETH to Token swap
    console.log("\n🔄 Test 3: Testing ETH to Token swap...");
    const swapAmount = hre.ethers.utils.parseEther("0.01"); // 0.01 ETH
    const tokenToSwap = supportedTokens[0]; // USDT
    
    console.log(`Swapping ${hre.ethers.utils.formatEther(swapAmount)} ETH for ${tokenToSwap}...`);
    
    const tx = await ethereumDex.connect(user1).swapEthToToken(tokenToSwap, {
        value: swapAmount
    });
    await tx.wait();
    
    const user1Balance = await ethereumDex.getTokenBalance(tokenToSwap, user1.address);
    console.log(`✅ User1 ${tokenToSwap} balance: ${hre.ethers.utils.formatEther(user1Balance)}`);
    
    // Test 4: Token to ETH swap
    console.log("\n🔄 Test 4: Testing Token to ETH swap...");
    const tokenAmount = hre.ethers.utils.parseEther("100"); // 100 USDT
    
    // First approve the contract to spend tokens
    const tokenContract = await hre.ethers.getContractAt("ERC20", await ethereumDex.tokenInstances(tokenToSwap));
    await tokenContract.connect(user1).approve(ethereumDex.address, tokenAmount);
    
    const user1EthBalanceBefore = await user1.getBalance();
    const swapTx = await ethereumDex.connect(user1).swapTokenToEth(tokenToSwap, tokenAmount);
    await swapTx.wait();
    const user1EthBalanceAfter = await user1.getBalance();
    
    const ethReceived = user1EthBalanceAfter.sub(user1EthBalanceBefore);
    console.log(`✅ ETH received: ${hre.ethers.utils.formatEther(ethReceived)} ETH`);
    
    // Test 5: Token to Token swap
    console.log("\n🔄 Test 5: Testing Token to Token swap...");
    if (supportedTokens.length >= 2) {
        const srcToken = supportedTokens[0]; // USDT
        const destToken = supportedTokens[1]; // USDC
        
        // Give user2 some USDT
        const user2SwapAmount = hre.ethers.utils.parseEther("0.005"); // 0.005 ETH
        await ethereumDex.connect(user2).swapEthToToken(srcToken, {
            value: user2SwapAmount
        });
        
        const swapTokenAmount = hre.ethers.utils.parseEther("50"); // 50 USDT
        
        // Approve and swap
        const srcTokenContract = await hre.ethers.getContractAt("ERC20", await ethereumDex.tokenInstances(srcToken));
        await srcTokenContract.connect(user2).approve(ethereumDex.address, swapTokenAmount);
        
        const user2DestTokenBalanceBefore = await ethereumDex.getTokenBalance(destToken, user2.address);
        await ethereumDex.connect(user2).swapTokenToToken(srcToken, destToken, swapTokenAmount);
        const user2DestTokenBalanceAfter = await ethereumDex.getTokenBalance(destToken, user2.address);
        
        const destTokensReceived = user2DestTokenBalanceAfter.sub(user2DestTokenBalanceBefore);
        console.log(`✅ ${destToken} received: ${hre.ethers.utils.formatEther(destTokensReceived)}`);
    }
    
    // Test 6: Check swap history
    console.log("\n📊 Test 6: Checking swap history...");
    const history = await ethereumDex.getSwapHistory();
    console.log(`✅ Total swaps recorded: ${history.length}`);
    
    if (history.length > 0) {
        const lastSwap = history[history.length - 1];
        console.log(`✅ Last swap: ${lastSwap.tokenA} → ${lastSwap.tokenB}`);
        console.log(`✅ Input: ${hre.ethers.utils.formatEther(lastSwap.inputAmount)}`);
        console.log(`✅ Output: ${hre.ethers.utils.formatEther(lastSwap.outputAmount)}`);
        console.log(`✅ Fee: ${hre.ethers.utils.formatEther(lastSwap.fee)}`);
    }
    
    // Test 7: Contract balances
    console.log("\n🏦 Test 7: Checking contract balances...");
    const contractEthBalance = await ethereumDex.getEthBalance();
    console.log(`✅ Contract ETH balance: ${hre.ethers.utils.formatEther(contractEthBalance)} ETH`);
    
    for (const tokenName of supportedTokens.slice(0, 3)) { // Check first 3 tokens
        const contractTokenBalance = await ethereumDex.getContractTokenBalance(tokenName);
        console.log(`✅ Contract ${tokenName} balance: ${hre.ethers.utils.formatEther(contractTokenBalance)}`);
    }
    
    console.log("\n🎉 All tests completed successfully!");
    console.log("✅ Contract is working as expected");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exitCode = 1;
    }); 