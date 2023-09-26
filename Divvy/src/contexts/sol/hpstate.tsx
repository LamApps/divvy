import { useState, createContext, useEffect } from "react"
import * as Accounts from "./accounts";
import { getAccountInfoAndSubscribe, useConnection } from "./connection";
import { AccountInfo, TokenAmount } from "@solana/web3.js";
import * as IDS from "../../utils/ids";
import { HPState, HPStateParser } from "../../models/sol/state/hpState";
export const HousePoolStateContext = createContext({
});

export const HousePoolStateProvider = (props: { children: any }) => {
    const connection = useConnection();

    useEffect(() => {
        let subscriptionId = getAccountInfoAndSubscribe(
            connection,
            IDS.HOUSE_POOL_STATE_ACCOUNT,
            parseAccount
        );

        async function parseAccount(acc: AccountInfo<Buffer> | null) {
            if (acc) {
                const parsed = HPStateParser(IDS.HOUSE_POOL_STATE_ACCOUNT, acc);
                // console.log(parsed);
            } else {
                // setHTBalance(0);
                // setAccountData(undefined);
            }
        }

        return () => {
            connection.removeAccountChangeListener(subscriptionId);
        };
    }, [connection]);
    return (
        <HousePoolStateContext.Provider value={{}}>
            {props.children}
        </HousePoolStateContext.Provider>
    )
}
