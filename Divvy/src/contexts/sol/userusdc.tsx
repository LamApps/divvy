import { useState, createContext, useEffect } from "react"
import * as Accounts from "./accounts";
import { getAccountInfoAndSubscribe, useConnection, useConnectionConfig } from "./connection";
import { AccountInfo } from "@solana/web3.js";
import * as IDS from "../../utils/ids";
import { EscrowState, EscrowStateParser } from "../../models/sol/state/escrowState";
import { useAccountByMint } from "../../hooks";
export const UserUSDCContext = createContext({
    userUSDC: 0,
});
export const UserUSDCContextProvider = (props: { children: any }) => {
    const connection = useConnection();
    const connectionConfig = useConnectionConfig();
    const USDCMint = IDS.getUsdtMint(connectionConfig.env);
    const userUSDCPubkey = useAccountByMint(USDCMint)?.pubkey
    let [accountData, setAccountData] =
        useState<Accounts.ParsedAccount<EscrowState>>();
    const [userUSDC, setUserUSDC] = useState(0);
    useEffect(() => {
        const check = async () => {
            if(userUSDCPubkey == null){
                setUserUSDC(0);
                setAccountData(undefined);
                return;
            }
            let subscriptionId = getAccountInfoAndSubscribe(
                connection,
                userUSDCPubkey,
                parseAccount
            );
            async function parseAccount(acc: AccountInfo<Buffer>|null) {
                if (acc && userUSDCPubkey) {
                    const parsed = EscrowStateParser(userUSDCPubkey, acc);
                    const data = await connection.getTokenAccountBalance(userUSDCPubkey);
                    setUserUSDC(parseInt(data.value.amount) || 0)
                    setAccountData(parsed)
                } else {
                    setUserUSDC(0);
                    setAccountData(undefined);
                }
            }
            return () => {
                connection.removeAccountChangeListener(subscriptionId);
            }
        }
        check()
    }, [connection, connectionConfig, userUSDCPubkey]);
    return (
        <UserUSDCContext.Provider value={{ userUSDC }}>
            {props.children}
        </UserUSDCContext.Provider>
    )
}
