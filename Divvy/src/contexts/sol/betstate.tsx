import { useState, createContext, useEffect } from "react"
import * as Accounts from "./accounts";
import { getAccountInfoAndSubscribe, useConnection } from "./connection";
import { AccountInfo, TokenAmount } from "@solana/web3.js";
import * as IDS from "../../utils/ids";
import { BetState, BetStateParser } from "../../models/sol/state/betState";
export const BetStateContext = createContext({
    liveLiquidity: 0,
    lockedLiquidity: 0,
    pendingBets: 0,
});

export const BetPoolStateProvider = (props: { children: any }) => {
    const connection = useConnection();
    const [liveLiquidity, setLiveLiquidity] = useState(0);
    const [lockedLiquidity, setLockedLiquidity] = useState(0);
    const [pendingBets, setPendingBets] = useState(0);

    useEffect(() => {
        let subscriptionId = getAccountInfoAndSubscribe(
            connection,
            IDS.BET_POOL_STATE_ACCOUNT,
            parseAccount
        );

        async function parseAccount(acc: AccountInfo<Buffer> | null) {
            if (acc) {
                const parsed = BetStateParser(IDS.BET_POOL_STATE_ACCOUNT, acc);
                console.log(parsed);
                setLiveLiquidity(parsed.info.liveLiquidity);
                setLockedLiquidity(parsed.info.lockedLiquidity);
                setPendingBets(parsed.info.pendingBets);
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
        <BetStateContext.Provider value={{ liveLiquidity, lockedLiquidity, pendingBets }}>
            {props.children}
        </BetStateContext.Provider>
    )
}
