import React, { useContext, useState } from "react";
import { Button, Select } from "antd";
import { ChainSelectContext } from "../contexts/chainselect";
import { ChainType } from "../constants/chains";
export const SelectChain = () => {
    const { chain, changeChain } = useContext(ChainSelectContext);
    const setChain = (value: ChainType) => {
        changeChain(value)
        window.location.reload()
    }
    return (
        <>
            <div style={{ display: "grid", marginLeft: 20 }}>
                <Select
                    onSelect={setChain}
                    value={chain}
                    style={{ marginBottom: 20, width: 140 }}
                >
                    {
                        Object.keys(ChainType).map(key => {
                            return (<Select.Option value={ChainType[key as keyof typeof ChainType]} key={ChainType[key as keyof typeof ChainType]}>
                                {ChainType[key as keyof typeof ChainType]}
                            </Select.Option>
                            )
                        })
                    }
                </Select>
            </div>
        </>
    );
};
