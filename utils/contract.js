import { ethers } from "ethers";
import EthereumDexLiteArtifact from "../utils/EthereumDexLite.json";
import CustomTokenArtifact from "../utils/CustomToken.json";

// Default DEX contract address
const DEX_CONTRACT_ADDRESS = "0x349847d1DBCa0E1F191ec29a5E1f15e3dA215d55";

export const EthereumDexLiteContract = async (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const {ethereum} = window;

    if (ethereum) {
        const signer = provider.getSigner();

        const contractReader = new ethers.Contract(address, CustomTokenArtifact.abi, signer);

        return contractReader;
    }
}

export const contract = async (address = DEX_CONTRACT_ADDRESS) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const {ethereum} = window;

    if (ethereum) {
        const signer = provider.getSigner();

        const contractReader = new ethers.Contract(
            address,
            EthereumDexLiteArtifact.abi,
             signer);
         return contractReader;
        }
}
