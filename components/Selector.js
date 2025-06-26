import React, { useState, useEffect } from "react";
import { Dropdown } from "@nextui-org/react";

import { ETH, USDT, USDC, DEFAULT_VALUE } from "../utils/saleToken";

const Selector = ({ defaultValue, ignoreValue, setToken, id }) => {
  const menu = [
    { key: ETH, name: "ETH" },
    { key: USDT, name: "USDT" },
    { key: USDC, name: "USDC" },
  ];

  const [selectedItem, setSelectedItem] = useState();
  const [menuItems, setMenuItems] = useState(getFilteredItems(ignoreValue));

  function getFilteredItems(ignoreValue) {
    return menu.filter((item) => item.key !== ignoreValue);
  }

  useEffect(() => {
    setSelectedItem(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setMenuItems(getFilteredItems(ignoreValue));
  }, [ignoreValue]);

  return (
    <Dropdown>
      <Dropdown.Button
        css={{
          backgroundColor:
            selectedItem === DEFAULT_VALUE ? "#77765F3" : "#2C2F36",
        }}
      >
        {selectedItem}
      </Dropdown.Button>
      <Dropdown.Menu
        aria-label="Dynamic Actions"
        items={menuItems}
        onAction={(key) => {
          setSelectedItem(key);
          setToken(key);
        }}
      >
        {(item) => (
          <Dropdown.Item 
            aria-label={id} 
            key={item.key}
            color={item.key === "delete" ? "error" : "default"}>
            {item.name}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Selector; 