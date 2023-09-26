import { useLocalStorageState } from "../../utils/utils";
import {
  Account,
  Signer,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SendOptions,
  Commitment,
  RpcResponseAndContext,
  AccountInfo,
  Context,
} from "@solana/web3.js";
import React, { useContext, useEffect, useMemo } from "react";
import { notify } from "../../utils/notifications";
import { ExplorerLink, explorerUrl } from "../../components/ExplorerLink";
import { setProgramIds } from "../../utils/ids";
import { WalletAdapter } from "./wallet";
import { ENDPOINTS, ENV } from "../../constants/sol/env";
import axios from "axios";
import { DIVVY_API, DIVVY_API_STORE_TXNS } from "../../constants/urls";
import { Transactions } from "../../constants/bets";

const DEFAULT = ENDPOINTS[2].endpoint;
const DEFAULT_SLIPPAGE = 0.25;
const DEFAULT_COMMITMENT = "singleGossip";

interface ConnectionConfig {
  connection: Connection;
  sendConnection: Connection;
  endpoint: string;
  slippage: number;
  setSlippage: (val: number) => void;
  env: ENV;
  setEndpoint: (val: string) => void;
}

const ConnectionContext = React.createContext<ConnectionConfig>({
  endpoint: DEFAULT,
  setEndpoint: () => { },
  slippage: DEFAULT_SLIPPAGE,
  setSlippage: (val: number) => { },
  connection: new Connection(DEFAULT, DEFAULT_COMMITMENT),
  sendConnection: new Connection(DEFAULT, DEFAULT_COMMITMENT),
  env: ENDPOINTS[2].name,
});

export function ConnectionProvider({ children = undefined as any }) {
  const [endpoint, setEndpoint] = useLocalStorageState(
    "connectionEndpts",
    ENDPOINTS[2].endpoint
  );

  const [slippage, setSlippage] = useLocalStorageState(
    "slippage",
    DEFAULT_SLIPPAGE.toString()
  );

  const connection = useMemo(
    () => new Connection(endpoint, DEFAULT_COMMITMENT),
    [endpoint]
  );
  const sendConnection = useMemo(
    () => new Connection(endpoint, DEFAULT_COMMITMENT),
    [endpoint]
  );

  const chain =
    ENDPOINTS.find((end) => end.endpoint === endpoint) || ENDPOINTS[2];
  const env = chain.name;

  setProgramIds(env);

  // The websocket library solana/web3.js uses closes its websocket connection when the subscription list
  // is empty after opening its first time, preventing subsequent subscriptions from receiving responses.
  // This is a hack to prevent the list from every getting empty
  useEffect(() => {
    const id = connection.onAccountChange(new Account().publicKey, () => { });
    return () => {
      connection.removeAccountChangeListener(id);
    };
  }, [connection]);

  useEffect(() => {
    const id = connection.onSlotChange(() => null);
    return () => {
      connection.removeSlotChangeListener(id);
    };
  }, [connection]);

  useEffect(() => {
    const id = sendConnection.onAccountChange(
      new Account().publicKey,
      () => { }
    );
    return () => {
      sendConnection.removeAccountChangeListener(id);
    };
  }, [sendConnection]);

  useEffect(() => {
    const id = sendConnection.onSlotChange(() => null);
    return () => {
      sendConnection.removeSlotChangeListener(id);
    };
  }, [sendConnection]);

  return (
    <ConnectionContext.Provider
      value={{
        endpoint,
        setEndpoint,
        slippage: parseFloat(slippage),
        setSlippage: (val) => setSlippage(val.toString()),
        connection,
        sendConnection,
        env,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  return useContext(ConnectionContext).connection as Connection;
}

export function useSendConnection() {
  return useContext(ConnectionContext)?.sendConnection;
}

export function useConnectionConfig() {
  return useContext(ConnectionContext);
}

export function useSlippageConfig() {
  const { slippage, setSlippage } = useContext(ConnectionContext);
  return { slippage, setSlippage };
}

const getErrorForTransaction = async (connection: Connection, txid: string) => {
  // wait for all confirmation before geting transaction
  await connection.confirmTransaction(txid, "max");

  const tx = await connection.getParsedConfirmedTransaction(txid);

  const errors: string[] = [];
  if (tx?.meta && tx.meta.logMessages) {
    tx.meta.logMessages.forEach((log) => {
      const regex = /Error: (.*)/gm;
      let m;
      while ((m = regex.exec(log)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        if (m.length > 1) {
          errors.push(m[1]);
        }
      }
    });
  }

  return errors;
};

export const sendTransaction = async (
  connection: Connection,
  env: ENV,
  wallet: WalletAdapter,
  instructions: TransactionInstruction[],
  metaData: Array<Transactions>,
  signers?: Signer[],
  skipConfirmation?: boolean
): Promise<[ok: boolean, txid: string | undefined]> => {
  if (!wallet?.publicKey) {
    throw new Error("Wallet is not connected");
  }

  // Building phase
  let transaction = new Transaction();
  instructions.forEach((instruction) => transaction.add(instruction));
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;
  transaction.feePayer = wallet.publicKey;

  // Signing phase
  if (signers && signers.length > 0) {
    transaction.partialSign(...signers)
  }
  try {
    transaction = await wallet.signTransaction(transaction);
  }
  catch (ex) {
    // wallet refused to sign
    return [false, undefined];
  }
  notify({
    message: "Sending transaction...",
    type: "info",
  });
  let options: SendOptions = {
    skipPreflight: true,
    preflightCommitment: "singleGossip",
  };
  console.log(transaction.serializeMessage().toString("base64"));

  const txid = await connection.sendRawTransaction(
    transaction.serialize(),
    options
  );
  console.log(explorerUrl("transaction", txid, env));
  let ok = true;

  if (!skipConfirmation) {
    const status = (
      await connection.confirmTransaction(
        txid,
        options && (options.preflightCommitment as any)
      )
    ).value;
    if (status?.err) {
      ok = false;
      notify({
        message: "Transaction failed...",
        description: (
          <ExplorerLink address={txid} cluster={env} type="transaction" />
        ),
        type: "error",
      });
    } else {
      notify({
        message: "Transaction success...",
        description: (
          <ExplorerLink
            address={txid}
            cluster={env}
            type="transaction"
          />
        ),
      });
      //TO DO process this in backend
      metaData.map((item) => {
        axios.post(DIVVY_API + DIVVY_API_STORE_TXNS, {
          type: item.type,
          pubkey: wallet?.publicKey?.toString(),
          match: item.match,
          odds: item.odds,
          odds_type: item.odds_type,
          amount: item.amount,
          time: new Date().toUTCString(),
          txid,
        }).then((response) => {
          // do  nothing
        }).catch((error) => {
          //do nothing
          console.log(error)
        })
      })
    }
  }

  return [ok, txid];
};

export type AccountCallback = (acc: AccountInfo<Buffer> | null, context: Context) => void;
/**
 * Fetch an account for the specified public key and subscribe a callback
 * to be invoked whenever the specified account changes.
 *
 * @param connection Connection to use
 * @param publicKey Public key of the account to monitor
 * @param callback Function to invoke whenever the account is changed
 * @param commitment Specify the commitment level account changes must reach before notification
 * @return subscription id
 */
export const getAccountInfoAndSubscribe = function (
  connection: Connection,
  publicKey: PublicKey,
  callback: AccountCallback,
  commitment?: Commitment | undefined
): number {
  let latestSlot: number = -1;

  let subscriptionId = connection.onAccountChange(
    publicKey,
    (account: AccountInfo<Buffer>, context: Context) => {
      if (context.slot >= latestSlot) {
        latestSlot = context.slot;
        callback(account, context);
      }
    },
    commitment
  );

  connection
    .getAccountInfoAndContext(publicKey, commitment)
    .then((response) => {
      if (response.context.slot >= latestSlot) {
        latestSlot = response.context.slot;
        callback(response.value, response.context);
      }
    });

  return subscriptionId;
};