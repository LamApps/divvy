import { useState, createContext, useEffect } from "react"
import * as Accounts from "./accounts";
import { getAccountInfoAndSubscribe, useConnection } from "./connection";
import { AccountInfo, TokenAmount } from "@solana/web3.js";
import * as IDS from "../../utils/ids";
import { MintStateParser } from "../../models/sol/state/tokenState";
export const HPTokenContext = createContext({
    htSupply: 0
});

export const HPTokenProvider = (props: { children: any }) => {
    const connection = useConnection();
    const [htSupply, setHTSupply] = useState(0);

    useEffect(() => {
        let subscriptionId = getAccountInfoAndSubscribe(
            connection,
            IDS.HT_MINT,
            parseTokenMint
        );

        async function parseTokenMint(acc: AccountInfo<Buffer> | null) {
            if (acc) {
                const parsed = MintStateParser(IDS.HT_MINT, acc);
                setHTSupply(parsed.info.supply);
            } else {
                setHTSupply(0);
            }
        }

        return () => {
            connection.removeAccountChangeListener(subscriptionId);
        };
    }, [connection]);
    return (
        <HPTokenContext.Provider value={{ htSupply }}>
            {props.children}
        </HPTokenContext.Provider>
    )
}
