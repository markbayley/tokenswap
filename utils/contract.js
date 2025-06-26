import { ethers } from "ethers";
import EthereumDexLiteArtifact from "../utils/EthereumDexLite.json";
import CustomTokenArtifact from "../utils/CustomToken.json";

// Default DEX contract address
const DEX_CONTRACT_ADDRESS = "0x349847d1DBCa0E1F191ec29a5E1f15e3dA215d55";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

export const EthereumDexLiteContract = async (address) => {
    if (!isClient) {
        throw new Error("EthereumDexLiteContract can only be called on the client side");
    }

    const { ethereum } = window;
    if (!ethereum) {
        throw new Error("MetaMask is not installed");
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contractReader = new ethers.Contract(address, CustomTokenArtifact.abi, signer);

    return contractReader;
}

export const contract = async (address = DEX_CONTRACT_ADDRESS) => {
    if (!isClient) {
        throw new Error("Contract can only be called on the client side");
    }

    const { ethereum } = window;
    if (!ethereum) {
        throw new Error("MetaMask is not installed");
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contractReader = new ethers.Contract(
        address,
        EthereumDexLiteArtifact.abi,
        signer
    );
    
    return contractReader;
}
