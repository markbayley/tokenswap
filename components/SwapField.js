import React, { forwardRef } from "react";
import Selector from "./Selector";

const SwapField = forwardRef(({ obj }, inputRef) => {
  const { id, value = "", defaultValue, ignoreValue, setToken, disabled = false } = obj;

  // Determine placeholder text based on field type
  const getPlaceholder = () => {
    if (disabled) {
      return id === "srcToken" ? "From" : "Select token";
    }
    return "0.0";
  };

  // Check if this is the output field (destToken)
  const isOutputField = id === "destToken";

  return (
    <div>
      <div className="flex items-center justify-between rounded-xl">
        <input
          ref={inputRef}
          className={getInputClassName()}
          type="number"
          placeholder={getPlaceholder()}
          value={value}
          onChange={(e) => obj.setValue(e.target.value)}
          disabled={disabled || isOutputField}
          readOnly={isOutputField}
        />
        <Selector
          id={id}
          setToken={setToken}
          defaultValue={defaultValue}
          ignoreValue={ignoreValue}
        />
      </div>
    </div>
  );

  function getInputClassName() {
    let className =
      "bg-transparent appearance-none outline-none h-8 px-2 text-xl outline-none w-full";
    
    if (disabled || isOutputField) {
      className += " opacity-50 cursor-not-allowed";
    }
    
    return className;
  }
});

SwapField.displayName = "SwapField";

export default SwapField;
