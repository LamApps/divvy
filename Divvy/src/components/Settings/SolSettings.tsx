import React from "react";
import { Select } from "antd";
import { useConnectionConfig } from "../../contexts/sol/connection";
import { ENDPOINTS } from "../../constants/sol/env";
import { LANGUAGES, CURRENCIES } from "../../constants/settings";
export const SolSettings = () => {
  const { endpoint, setEndpoint } = useConnectionConfig();

  return (
    <>
      <div style={{display:"grid", color: 'white'}} className="sol-setting-item">
        Display Currency:{" "}
        <Select
          value={CURRENCIES[0].name}
        >
          {CURRENCIES.map(({ name, label }) => (
            <Select.Option value={name} key={name}>
              {label}
            </Select.Option>
          ))}
        </Select>       
      </div>
      <div style={{display:"grid", marginTop:'1rem', color: 'white'}} className="sol-setting-item">
        Display Language:{" "}
        <Select
          value={LANGUAGES[0].name}
        >
          {LANGUAGES.map(({ name, label }) => (
            <Select.Option value={name} key={name}>
              {label}
            </Select.Option>
          ))}
        </Select>       
      </div>
      <div style={{display:"grid", marginTop:'1rem', color: 'white'}} className="sol-setting-item">
        Network:{" "}
        <Select
          onSelect={setEndpoint}
          value={endpoint}
        >
          {ENDPOINTS.map(({ name, endpoint }) => (
            <Select.Option value={endpoint} key={endpoint}>
              {name}
            </Select.Option>
          ))}
        </Select>       
      </div>
    </>
  );
};
