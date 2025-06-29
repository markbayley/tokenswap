import React, { forwardRef } from "react";
import Selector from "./Selector";

const SwapField = forwardRef(({ obj }, inputRef) => {
  const { id, value = "", defaultValue, ignoreValue, setToken } = obj;

  return (
    <div>
      <div className="flex items-center justify-between rounded-xl">
        <input
          ref={inputRef}
          className={getInputClassName()}
          type="number"
          placeholder="0.0"
          value={value}
          onChange={(e) => obj.setValue(e.target.value)}
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
    return className;
  }
});

SwapField.displayName = "SwapField";

export default SwapField;
