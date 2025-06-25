import { ethers } from "ethers";
import { EthereumDexLiteContract, contract } from "./contract";
import { toEth, toWei } from "./utils";

// Helper to get bytes32 key from token name
function toTokenKey(tokenName) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tokenName));
}

// Helper to parse error messages
function parseErrorMsg(error) {
    if (error.code === 4001) {
        return "Transaction rejected by user";
    }
    if (error.message) {
        return error.message;
    }
    return "An error occurred";
}

export async function swapEthToToken(tokenName, amount) {
    try {
        const tokenKey = toTokenKey(tokenName);
        const tx = { value: toWei(amount, 18) };
        const contractObj = await contract();
        const txResponse = await contractObj.swapEthToToken(tokenKey, tx);
        return await txResponse.wait();
    } catch (error) {
        return parseErrorMsg(error);
    }
}

export async function hasValidBalance(owner, tokenName, amount, contractAddress = "0x349847d1DBCa0E1F191ec29a5E1f15e3dA215d55") {
    try {
        const tokenKey = toTokenKey(tokenName);
        const contractObj = await contract();
        const tokenAddress = await contractObj.tokenInstances(tokenKey);
        const tokenContractObj = await EthereumDexLiteContract(tokenAddress);
        const allowance = await tokenContractObj.allowance(owner, contractAddress);
        return ethers.BigNumber.from(allowance).gte(ethers.BigNumber.from(toWei(amount, 18)));
    } catch (error) {
        return parseErrorMsg(error);
    }
}

export async function swapTokenToEth(tokenName, amount) {
    try {
        const tokenKey = toTokenKey(tokenName);
        const contractObj = await contract();
        const txResponse = await contractObj.swapTokenToEth(tokenKey, toWei(amount, 18));
        return await txResponse.wait();
    } catch (error) {
        return parseErrorMsg(error);
    }
}

export async function getTokenBalance(tokenName, userAddress) {
    const tokenKey = toTokenKey(tokenName);
    const contractObj = await contract();
    return await contractObj.getTokenBalance(tokenKey, userAddress);
}

export async function getTokenAddress(tokenName) {
    const tokenKey = toTokenKey(tokenName);
    const contractObj = await contract();
    return await contractObj.tokenInstances(tokenKey);
}

export async function getTokenPrice(tokenName) {
    const tokenKey = toTokenKey(tokenName);
    const contractObj = await contract();
    return await contractObj.tokenPrices(tokenKey);
}

export async function withdrawFees() {
    try {
        const contractObj = await contract();
        const txResponse = await contractObj.withdrawFees();
        return await txResponse.wait();
    } catch (error) {
        return parseErrorMsg(error);
    }
}

export async function getOwner() {
    const contractObj = await contract();
    return await contractObj.owner();
}





