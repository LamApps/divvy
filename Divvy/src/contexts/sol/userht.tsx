import { useState, createContext, useEffect } from "react"
import * as Accounts from "./accounts";
import { getAccountInfoAndSubscribe, useConnection } from "./connection";
import { AccountInfo } from "@solana/web3.js";
import * as IDS from "../../utils/ids";
import { EscrowState, EscrowStateParser } from "../../models/sol/state/escrowState";
import { WalletContext } from "./wallet"
import { useAccountByMint } from "../../hooks";
export const UserHTContext = createContext({
    userHT: 0
});
export const UserHTContextProvider = (props: { children: any }) => {
    const connection = useConnection();
    const userHTPubkey = useAccountByMint(IDS.HT_MINT)?.pubkey
    let [accountData, setAccountData] =
        useState<Accounts.ParsedAccount<EscrowState>>();
    const [userHT, setUserHT] = useState(0);
    useEffect(() => {
        const check = async () => {
            if(userHTPubkey == null){
                setUserHT(0);
                setAccountData(undefined);
                return;
            }
            let subscriptionId = getAccountInfoAndSubscribe(
                connection,
                userHTPubkey,
                parseAccount
            );
            async function parseAccount(acc: AccountInfo<Buffer>|null) {
                if(acc && userHTPubkey) {
                    const parsed = EscrowStateParser(userHTPubkey, acc);
                    const data = await connection.getTokenAccountBalance(userHTPubkey);
                    setUserHT(parseInt(data.value.amount) || 0);
                    setAccountData(parsed);
                } else {
                    setUserHT(0);
                    setAccountData(undefined);
                }
            }
            return () => {
                connection.removeAccountChangeListener(subscriptionId);
            }
        }
        check()
    }, [connection, userHTPubkey]);
    return (
        <UserHTContext.Provider value={{ userHT }}>
            {props.children}
        </UserHTContext.Provider>
    )
}
