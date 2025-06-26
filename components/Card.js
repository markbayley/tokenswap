import React from "react";
import SwapComponent from "./SwapComponent";
import PriceUpdater from "./PriceUpdater";

const Card = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Swap Component */}
          <div className="flex justify-center">
            <SwapComponent />
          </div>
          
          {/* Price Updater Component */}
          <div className="flex justify-center">
            <PriceUpdater />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
