import React, { useState } from "react";
import { updateTokenPrice, getTokenPrice } from "../utils/context";
import { toWei } from "../utils/utils";
import { ETH, USDT, USDC } from "../utils/saleToken";
import toast, { Toaster } from "react-hot-toast";

const PriceUpdater = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPrices, setCurrentPrices] = useState({});

  // Helper function to convert USD price to wei
  const usdToWei = (usdPrice) => {
    // Convert USD price to ETH equivalent (assuming 1 ETH = $2460)
    // For $1.00 USDT/USDC, we want 1/2460 ETH = 0.0004065 ETH
    // Convert to wei: 0.0004065 * 10^18 = 406,504,065,040,650,400 wei
    const ethPrice = usdPrice / 2460;
    // Use a more precise calculation to avoid decimal overflow
    const weiValue = Math.floor(ethPrice * Math.pow(10, 18));
    return weiValue.toString();
  };

  // Update USDT price to $1.00
  const updateUSDTPrice = async () => {
    setIsUpdating(true);
    try {
      const newPrice = usdToWei(1.00); // $1.00 per USDT
      const receipt = await updateTokenPrice(USDT, newPrice);
      if (receipt && receipt.transactionHash) {
        toast.success("USDT price updated to $1.00");
        setCurrentPrices(prev => ({ ...prev, USDT: 1.00 }));
      } else {
        toast.error("Failed to update USDT price");
      }
    } catch (error) {
      console.error("Error updating USDT price:", error);
      toast.error("Error updating USDT price");
    } finally {
      setIsUpdating(false);
    }
  };

  // Update USDC price to $1.00
  const updateUSDCPrice = async () => {
    setIsUpdating(true);
    try {
      const newPrice = usdToWei(1.00); // $1.00 per USDC
      const receipt = await updateTokenPrice(USDC, newPrice);
      if (receipt && receipt.transactionHash) {
        toast.success("USDC price updated to $1.00");
        setCurrentPrices(prev => ({ ...prev, USDC: 1.00 }));
      } else {
        toast.error("Failed to update USDC price");
      }
    } catch (error) {
      console.error("Error updating USDC price:", error);
      toast.error("Error updating USDC price");
    } finally {
      setIsUpdating(false);
    }
  };

  // Update to current market prices
  const updateToMarketPrices = async () => {
    setIsUpdating(true);
    try {
      // Update USDT to $1.00
      const usdtPrice = usdToWei(1.00);
      const usdtReceipt = await updateTokenPrice(USDT, usdtPrice);
      
      // Update USDC to $1.00
      const usdcPrice = usdToWei(1.00);
      const usdcReceipt = await updateTokenPrice(USDC, usdcPrice);
      
      if (usdtReceipt && usdtReceipt.transactionHash && 
          usdcReceipt && usdcReceipt.transactionHash) {
        toast.success("Token prices updated to market rates");
        setCurrentPrices({ USDT: 1.00, USDC: 1.00 });
      } else {
        toast.error("Failed to update some token prices");
      }
    } catch (error) {
      console.error("Error updating market prices:", error);
      toast.error("Error updating market prices");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="border border-[#7765F3] bg-gradient-to-r from-[#7765F3] to-[#4D44B5] w-full max-w-xl p-4 px-6 rounded-xl mb-4">
      <div className="flex items-center justify-between py-4 px-1">
        <p className="text-white font-semibold text-xl">Update Token Prices</p>
      </div>
      
      <div className="bg-[#212429] p-4 py-6 rounded-xl mb-4">
        <p className="text-zinc-300 text-sm mb-4">
          Update token prices to reflect current market rates. This will make the conversion rates more realistic.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={updateUSDTPrice}
            disabled={isUpdating}
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors"
          >
            {isUpdating ? "Updating..." : "Update USDT to $1.00"}
          </button>
          
          <button
            onClick={updateUSDCPrice}
            disabled={isUpdating}
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors"
          >
            {isUpdating ? "Updating..." : "Update USDC to $1.00"}
          </button>
          
          <button
            onClick={updateToMarketPrices}
            disabled={isUpdating}
            className="w-full p-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg font-medium transition-colors"
          >
            {isUpdating ? "Updating..." : "Update All to Market Prices"}
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
          <p className="text-zinc-400 text-sm">
            <strong>Current Market Rates:</strong><br/>
            • 1 ETH = $2,460 USD<br/>
            • 1 USDT = $1.00 USD<br/>
            • 1 USDC = $1.00 USD<br/>
            <br/>
            <strong>Expected Conversion:</strong><br/>
            • 1 ETH = 2,460 USDT/USDC
          </p>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default PriceUpdater; 