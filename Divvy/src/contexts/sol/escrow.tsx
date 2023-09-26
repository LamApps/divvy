import * as Accounts from "./accounts";
import { getAccountInfoAndSubscribe, useConnection } from "./connection";
import {
  AccountInfo,
  RpcResponseAndContext,
} from "@solana/web3.js";
import * as IDS from "../../utils/ids";
import { EscrowState, EscrowStateParser } from "../../models/sol/state/escrowState";
import React, { useContext, useEffect, useState } from "react";

export interface EscrowContextState {
  escrow: Accounts.ParsedAccount<EscrowState> | undefined;
}

const EscrowContext = React.createContext<EscrowContextState>(
  {} as EscrowContextState
);

export const EscrowProvider = ({ children = null as any }) => {
  const connection = useConnection();
  let [accountData, setAccountData] =
    useState<Accounts.ParsedAccount<EscrowState>>();

  useEffect(() => {
    let subscriptionId = getAccountInfoAndSubscribe(
      connection,
      IDS.HOUSE_POOL_STATE_ACCOUNT,
      parseAccount
    );

    function parseAccount(acc: AccountInfo<Buffer>|null) {
      if(acc) {
        setAccountData(EscrowStateParser(IDS.HOUSE_POOL_STATE_ACCOUNT, acc));
      } else {
        setAccountData(undefined);
      }
    }

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection]);

  return (
    <EscrowContext.Provider
      value={{
        escrow: accountData,
      }}
    >
      {children}
    </EscrowContext.Provider>
  );
};

export const useEscrow = () => {
  return useContext(EscrowContext) as EscrowContextState;
};