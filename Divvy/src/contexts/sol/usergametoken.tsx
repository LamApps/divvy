import { useState, createContext, useEffect, useContext } from "react"
import * as Accounts from "./accounts";
import { getAccountInfoAndSubscribe, useConnection, useConnectionConfig } from "./connection";
import { AccountInfo } from "@solana/web3.js";
import * as IDS from "../../utils/ids";
import { EscrowState, EscrowStateParser } from "../../models/sol/state/escrowState";
import { useAccountByMint } from "../../hooks";
import { useWallet } from "./wallet";
import { MoonshotSocketContext } from "../moonshot-socket";
export const UserGameTokenContext = createContext({
    userGameToken: 0,
});
export const UserGameTokenBalanceContextProvider = (props: { children: any }) => {
    const {connected, publicKey} = useWallet();
    const [userGameToken, setUserGameToken] = useState(0);
    const socket = useContext(MoonshotSocketContext);
    useEffect(() => {
        if (!connected) setUserGameToken(0);
        socket.on('balance', data => {
            if (!data) return;
            setUserGameToken(data);
        })
    }, [connected, socket]);
    return (
        <UserGameTokenContext.Provider value={{ userGameToken }}>
            {props.children}
        </UserGameTokenContext.Provider>
    )
}
