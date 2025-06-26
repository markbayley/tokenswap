// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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
 * @title EthereumDexLite
 * @dev A lightweight DEX for swapping tokens and ETH (gas optimized)
 */
contract EthereumDexLite is ReentrancyGuard, Ownable {
    // Token configuration - using bytes32 for gas efficiency
    mapping(bytes32 => ERC20) public tokenInstances;
    mapping(bytes32 => uint256) public tokenPrices;
    
    // Events
    event SwapExecuted(
        address indexed user,
        bytes32 tokenA,
        bytes32 tokenB,
        uint256 inputAmount,
        uint256 outputAmount
    );
    
    // Modifiers
    modifier tokenExists(bytes32 tokenName) {
        require(address(tokenInstances[tokenName]) != address(0), "Token not supported");
        _;
    }
    
    constructor() {
        // Initialize with fewer tokens to reduce deployment cost
        _addToken("USDT", 0.0005 ether);
        _addToken("USDC", 0.0005 ether);
    }
    
    /**
     * @dev Swap ETH for tokens
     */
    function swapEthToToken(bytes32 tokenName) 
        external 
        payable 
        nonReentrant 
        tokenExists(tokenName)
        returns (uint256 outputAmount)
    {
        require(msg.value >= 0.001 ether, "Amount too small");
        
        uint256 fee = (msg.value * 30) / 10000; // 0.3% fee
        uint256 swapAmount = msg.value - fee;
        
        uint256 tokenPrice = tokenPrices[tokenName];
        outputAmount = (swapAmount * 10**18) / tokenPrice;
        
        require(outputAmount >= 1 * 10**18, "Output amount too small");
        
        tokenInstances[tokenName].transfer(msg.sender, outputAmount);
        
        emit SwapExecuted(msg.sender, "ETH", tokenName, msg.value, outputAmount);
        
        return outputAmount;
    }
    
    /**
     * @dev Swap tokens for ETH
     */
    function swapTokenToEth(bytes32 tokenName, uint256 amount) 
        external 
        nonReentrant 
        tokenExists(tokenName)
        returns (uint256 outputAmount)
    {
        require(amount >= 1 * 10**18, "Amount too small");
        
        uint256 tokenPrice = tokenPrices[tokenName];
        uint256 ethValue = (amount * tokenPrice) / 10**18;
        uint256 fee = (ethValue * 30) / 10000; // 0.3% fee
        outputAmount = ethValue - fee;
        
        require(outputAmount >= 0.001 ether, "Output amount too small");
        require(address(this).balance >= outputAmount, "Insufficient ETH balance");
        
        tokenInstances[tokenName].transferFrom(msg.sender, address(this), amount);
        
        (bool success, ) = payable(msg.sender).call{value: outputAmount}("");
        require(success, "ETH transfer failed");
        
        emit SwapExecuted(msg.sender, tokenName, "ETH", amount, outputAmount);
        
        return outputAmount;
    }
    
    /**
     * @dev Get user's token balance
     */
    function getTokenBalance(bytes32 tokenName, address userAddress) 
        external 
        view 
        tokenExists(tokenName)
        returns (uint256) 
    {
        return tokenInstances[tokenName].balanceOf(userAddress);
    }
    
    /**
     * @dev Add token to supported list
     */
    function _addToken(string memory tokenName, uint256 priceInWei) internal {
        bytes32 tokenKey = keccak256(abi.encodePacked(tokenName));
        CustomToken newToken = new CustomToken(tokenName, tokenName);
        tokenInstances[tokenKey] = newToken;
        tokenPrices[tokenKey] = priceInWei;
    }
    
    /**
     * @dev Update token price (only owner)
     */
    function updateTokenPrice(bytes32 tokenName, uint256 newPrice) external onlyOwner {
        require(address(tokenInstances[tokenName]) != address(0), "Token not supported");
        require(newPrice > 0, "Price must be greater than 0");
        tokenPrices[tokenName] = newPrice;
    }
    
    /**
     * @dev Get current token price
     */
    function getTokenPrice(bytes32 tokenName) external view tokenExists(tokenName) returns (uint256) {
        return tokenPrices[tokenName];
    }
    
    /**
     * @dev Withdraw collected fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Fee withdrawal failed");
    }
    
    /**
     * @dev Receive ETH
     */
    receive() external payable {}
} 