import React from "react";
import { Button, Select } from "antd";
import { useWallet } from "../../contexts/sol/wallet";
import { ENDPOINTS } from "../../utils/ethEndpoints";
export const EthSettings = () => {
  return (
    <>
      <div style={{ display: "grid" }}>
        Network:{" "}
        <Select
          //   onSelect={setEndpoint}
          //   value={endpoint}
          style={{ marginBottom: 20 }}
        >
          {ENDPOINTS.map(({ name }) => (
            <Select.Option value={name} key={name}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </div>
    </>
  );
};
