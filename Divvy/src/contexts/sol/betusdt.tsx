import { useState, createContext, useEffect } from "react"
import * as Accounts from "./accounts";
import { getAccountInfoAndSubscribe, useConnection } from "./connection";
import { AccountInfo, TokenAmount } from "@solana/web3.js";
import * as IDS from "../../utils/ids";
import { EscrowState, EscrowStateParser } from "../../models/sol/state/escrowState";
export const BetPoolContext = createContext({
    accountData: undefined as Accounts.ParsedAccount<EscrowState> | undefined,
    bettorBalance: 0
});

export const BetPoolProvider = (props: { children: any }) => {
    const connection = useConnection();
    let [accountData, setAccountData] =
        useState<Accounts.ParsedAccount<EscrowState>>();
    const [bettorBalance, setBettorBalance] = useState(0);

    useEffect(() => {
        let subscriptionId = getAccountInfoAndSubscribe(
            connection,
            IDS.BET_POOL_USDC_ACCOUNT,
            parseAccount
        );
        
        async function parseAccount(acc: AccountInfo<Buffer> | null) {
            if (acc) {
                const parsed = EscrowStateParser(IDS.BET_POOL_USDC_ACCOUNT, acc);
                const data = await connection.getTokenAccountBalance(IDS.BET_POOL_USDC_ACCOUNT);
                
                setBettorBalance(parseInt(data.value.amount) || 0);
                setAccountData(parsed);
            } else {
                setBettorBalance(0);
                setAccountData(undefined);
            }
        }

        return () => {
            connection.removeAccountChangeListener(subscriptionId);
        };
    }, [connection]);
    return (
        <BetPoolContext.Provider value={{ accountData, bettorBalance }}>
            {props.children}
        </BetPoolContext.Provider>
    )
}
