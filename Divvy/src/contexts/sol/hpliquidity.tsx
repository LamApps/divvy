import { useState, createContext, useEffect } from "react"
import * as Accounts from "./accounts";
import { getAccountInfoAndSubscribe, useConnection } from "./connection";
import { AccountInfo, TokenAmount } from "@solana/web3.js";
import * as IDS from "../../utils/ids";
import { EscrowState, EscrowStateParser } from "../../models/sol/state/escrowState";
export const HousePoolContext = createContext({
    accountData: undefined as Accounts.ParsedAccount<EscrowState> | undefined,
    htBalance: 0
});

export const HousePoolProvider = (props: { children: any }) => {
    const connection = useConnection();
    let [accountData, setAccountData] =
        useState<Accounts.ParsedAccount<EscrowState>>();
    const [htBalance, setHTBalance] = useState(0);

    useEffect(() => {
        let subscriptionId = getAccountInfoAndSubscribe(
            connection,
            IDS.HOUSE_POOL_USDC_ACCOUNT,
            parseAccount
        );
        
        async function parseAccount(acc: AccountInfo<Buffer> | null) {
            if (acc) {
                const parsed = EscrowStateParser(IDS.HOUSE_POOL_USDC_ACCOUNT, acc);
                const data = await connection.getTokenAccountBalance(IDS.HOUSE_POOL_USDC_ACCOUNT);
                setHTBalance(parseInt(data.value.amount) || 0);
                setAccountData(parsed);
            } else {
                setHTBalance(0);
                setAccountData(undefined);
            }
        }

        return () => {
            connection.removeAccountChangeListener(subscriptionId);
        };
    }, [connection]);
    return (
        <HousePoolContext.Provider value={{ accountData, htBalance }}>
            {props.children}
        </HousePoolContext.Provider>
    )
}
