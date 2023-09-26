import { useState, createContext, useEffect } from "react"
import { ChainType } from "../constants/chains";
const CHAIN_KEY: string = "chain"
export const ChainSelectContext = createContext<{
  chain: ChainType,
  changeChain: (chain:ChainType) => void
}>(null as any);

const ChainProvider = (props: { children: any }) => {
    let [chain, setChain] = useState<ChainType>(localStorage.getItem(CHAIN_KEY) as ChainType ?? ChainType.Sol);
    useEffect(() => {
        const getChain = async () => {
            const chain: any = localStorage.getItem(CHAIN_KEY)
            if (chain) {
                setChain(chain)
            } else {
                setChain(ChainType.Sol)
            }
        }
        getChain()
    }, [])
    function changeChain(chain: ChainType) {
        localStorage.setItem(CHAIN_KEY, chain)
        setChain(chain);
    };
    return (
        <ChainSelectContext.Provider value={{ chain, changeChain }}>
            {props.children}
        </ChainSelectContext.Provider>
    )
}
export default ChainProvider