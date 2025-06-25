// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title CustomToken
 * @dev ERC20 token with initial supply
 */
contract CustomToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 10000000 * 10 ** decimals());
    }
}

/**
 * @title EthereumDex
 * @dev A decentralized exchange for swapping tokens and ETH on Ethereum
 */
contract EthereumDex is ReentrancyGuard, Ownable, Pausable {
    // Token configuration
    string[] public supportedTokens;
    mapping(string => ERC20) public tokenInstances;
    mapping(string => uint256) public tokenPrices; // Price in wei per token
    
    // Minimum swap amounts
    uint256 public constant MIN_ETH_AMOUNT = 0.001 ether;
    uint256 public constant MIN_TOKEN_AMOUNT = 1 * 10**18;
    
    // Fee configuration (0.3% = 30 basis points)
    uint256 public constant FEE_BASIS_POINTS = 30;
    uint256 public constant BASIS_POINTS_DENOMINATOR = 10000;
    
    // Events
    event TokenAdded(string tokenName, address tokenAddress, uint256 price);
    event SwapExecuted(
        address indexed user,
        string tokenA,
        string tokenB,
        uint256 inputAmount,
        uint256 outputAmount,
        uint256 fee
    );
    event PriceUpdated(string tokenName, uint256 oldPrice, uint256 newPrice);
    event FeesCollected(address indexed owner, uint256 amount);
    
    // Transaction history
    struct SwapHistory {
        uint256 historyId;
        string tokenA;
        string tokenB;
        uint256 inputAmount;
        uint256 outputAmount;
        uint256 fee;
        address userAddress;
        uint256 timestamp;
    }
    
    uint256 public historyIndex;
    mapping(uint256 => SwapHistory) private swapHistory;
    
    // Modifiers
    modifier tokenExists(string memory tokenName) {
        require(address(tokenInstances[tokenName]) != address(0), "Token not supported");
        _;
    }
    
    modifier validAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than 0");
        _;
    }
    
    constructor() {
        // Initialize with common tokens
        _addToken("USDT", 0.0005 ether); // $1 = 0.0005 ETH
        _addToken("USDC", 0.0005 ether);
        _addToken("LINK", 0.008 ether);  // $16 = 0.008 ETH
        _addToken("UNI", 0.006 ether);   // $12 = 0.006 ETH
        _addToken("AAVE", 0.08 ether);   // $160 = 0.08 ETH
    }
    
    /**
     * @dev Add a new token to the DEX
     * @param tokenName Name of the token
     * @param priceInWei Price of token in wei
     */
    function addToken(string memory tokenName, uint256 priceInWei) 
        external 
        onlyOwner 
        validAmount(priceInWei) 
    {
        require(address(tokenInstances[tokenName]) == address(0), "Token already exists");
        
        CustomToken newToken = new CustomToken(tokenName, tokenName);
        tokenInstances[tokenName] = newToken;
        tokenPrices[tokenName] = priceInWei;
        supportedTokens.push(tokenName);
        
        emit TokenAdded(tokenName, address(newToken), priceInWei);
    }
    
    /**
     * @dev Update token price
     * @param tokenName Name of the token
     * @param newPrice New price in wei
     */
    function updateTokenPrice(string memory tokenName, uint256 newPrice) 
        external 
        onlyOwner 
        tokenExists(tokenName)
        validAmount(newPrice)
    {
        uint256 oldPrice = tokenPrices[tokenName];
        tokenPrices[tokenName] = newPrice;
        
        emit PriceUpdated(tokenName, oldPrice, newPrice);
    }
    
    /**
     * @dev Swap ETH for tokens
     * @param tokenName Name of the token to receive
     * @return outputAmount Amount of tokens received
     */
    function swapEthToToken(string memory tokenName) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
        tokenExists(tokenName)
        validAmount(msg.value)
        returns (uint256 outputAmount)
    {
        require(msg.value >= MIN_ETH_AMOUNT, "Amount too small");
        
        uint256 fee = (msg.value * FEE_BASIS_POINTS) / BASIS_POINTS_DENOMINATOR;
        uint256 swapAmount = msg.value - fee;
        
        uint256 tokenPrice = tokenPrices[tokenName];
        outputAmount = (swapAmount * 10**18) / tokenPrice;
        
        require(outputAmount >= MIN_TOKEN_AMOUNT, "Output amount too small");
        
        // Transfer tokens to user
        require(
            tokenInstances[tokenName].transfer(msg.sender, outputAmount),
            "Token transfer failed"
        );
        
        // Record transaction
        _recordSwap(tokenName, "ETH", msg.value, outputAmount, fee);
        
        emit SwapExecuted(msg.sender, "ETH", tokenName, msg.value, outputAmount, fee);
        
        return outputAmount;
    }
    
    /**
     * @dev Swap tokens for ETH
     * @param tokenName Name of the token to swap
     * @param amount Amount of tokens to swap
     * @return outputAmount Amount of ETH received
     */
    function swapTokenToEth(string memory tokenName, uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
        tokenExists(tokenName)
        validAmount(amount)
        returns (uint256 outputAmount)
    {
        require(amount >= MIN_TOKEN_AMOUNT, "Amount too small");
        
        uint256 tokenPrice = tokenPrices[tokenName];
        uint256 ethValue = (amount * tokenPrice) / 10**18;
        uint256 fee = (ethValue * FEE_BASIS_POINTS) / BASIS_POINTS_DENOMINATOR;
        outputAmount = ethValue - fee;
        
        require(outputAmount >= MIN_ETH_AMOUNT, "Output amount too small");
        require(address(this).balance >= outputAmount, "Insufficient ETH balance");
        
        // Transfer tokens from user to contract
        require(
            tokenInstances[tokenName].transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );
        
        // Transfer ETH to user
        (bool success, ) = payable(msg.sender).call{value: outputAmount}("");
        require(success, "ETH transfer failed");
        
        // Record transaction
        _recordSwap(tokenName, "ETH", amount, outputAmount, fee);
        
        emit SwapExecuted(msg.sender, tokenName, "ETH", amount, outputAmount, fee);
        
        return outputAmount;
    }
    
    /**
     * @dev Swap tokens for tokens
     * @param srcTokenName Source token name
     * @param destTokenName Destination token name
     * @param amount Amount of source tokens
     * @return outputAmount Amount of destination tokens received
     */
    function swapTokenToToken(
        string memory srcTokenName, 
        string memory destTokenName, 
        uint256 amount
    ) 
        external 
        nonReentrant 
        whenNotPaused 
        tokenExists(srcTokenName)
        tokenExists(destTokenName)
        validAmount(amount)
        returns (uint256 outputAmount)
    {
        require(keccak256(bytes(srcTokenName)) != keccak256(bytes(destTokenName)), "Same token");
        require(amount >= MIN_TOKEN_AMOUNT, "Amount too small");
        
        uint256 srcTokenPrice = tokenPrices[srcTokenName];
        uint256 destTokenPrice = tokenPrices[destTokenName];
        
        // Calculate ETH value of source tokens
        uint256 ethValue = (amount * srcTokenPrice) / 10**18;
        uint256 fee = (ethValue * FEE_BASIS_POINTS) / BASIS_POINTS_DENOMINATOR;
        uint256 swapValue = ethValue - fee;
        
        // Calculate destination token amount
        outputAmount = (swapValue * 10**18) / destTokenPrice;
        
        require(outputAmount >= MIN_TOKEN_AMOUNT, "Output amount too small");
        
        // Transfer source tokens from user to contract
        require(
            tokenInstances[srcTokenName].transferFrom(msg.sender, address(this), amount),
            "Source token transfer failed"
        );
        
        // Transfer destination tokens to user
        require(
            tokenInstances[destTokenName].transfer(msg.sender, outputAmount),
            "Destination token transfer failed"
        );
        
        // Record transaction
        _recordSwap(srcTokenName, destTokenName, amount, outputAmount, fee);
        
        emit SwapExecuted(msg.sender, srcTokenName, destTokenName, amount, outputAmount, fee);
    }
    
    /**
     * @dev Get user's token balance
     * @param tokenName Name of the token
     * @param userAddress User's address
     * @return balance Token balance
     */
    function getTokenBalance(string memory tokenName, address userAddress) 
        external 
        view 
        tokenExists(tokenName)
        returns (uint256 balance) 
    {
        return tokenInstances[tokenName].balanceOf(userAddress);
    }
    
    /**
     * @dev Get contract's token balance
     * @param tokenName Name of the token
     * @return balance Contract's token balance
     */
    function getContractTokenBalance(string memory tokenName) 
        external 
        view 
        tokenExists(tokenName)
        returns (uint256 balance) 
    {
        return tokenInstances[tokenName].balanceOf(address(this));
    }
    
    /**
     * @dev Get all swap history
     * @return history Array of swap history
     */
    function getSwapHistory() external view returns (SwapHistory[] memory history) {
        uint256 count = historyIndex;
        history = new SwapHistory[](count);
        
        for (uint256 i = 0; i < count; i++) {
            history[i] = swapHistory[i + 1];
        }
        
        return history;
    }
    
    /**
     * @dev Get supported tokens
     * @return tokens Array of supported token names
     */
    function getSupportedTokens() external view returns (string[] memory tokens) {
        tokens = supportedTokens;
        return tokens;
    }
    
    /**
     * @dev Withdraw collected fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Fee withdrawal failed");
        
        emit FeesCollected(owner(), balance);
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Record swap transaction
     */
    function _recordSwap(
        string memory tokenA,
        string memory tokenB,
        uint256 inputAmount,
        uint256 outputAmount,
        uint256 fee
    ) internal {
        historyIndex++;
        swapHistory[historyIndex] = SwapHistory({
            historyId: historyIndex,
            tokenA: tokenA,
            tokenB: tokenB,
            inputAmount: inputAmount,
            outputAmount: outputAmount,
            fee: fee,
            userAddress: msg.sender,
            timestamp: block.timestamp
        });
    }
    
    /**
     * @dev Add token to supported list
     */
    function _addToken(string memory tokenName, uint256 priceInWei) internal {
        CustomToken newToken = new CustomToken(tokenName, tokenName);
        tokenInstances[tokenName] = newToken;
        tokenPrices[tokenName] = priceInWei;
        supportedTokens.push(tokenName);
    }
    
    /**
     * @dev Receive ETH
     */
    receive() external payable {
        // Allow contract to receive ETH
    }
} 