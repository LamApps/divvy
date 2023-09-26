import { AccountInfo, PublicKey } from "@solana/web3.js";
import * as BufferLayout from "buffer-layout";
import { ParsedAccount } from "../../../contexts/sol/accounts";

export const HP_STATE_LAYOUT = BufferLayout.struct([
  BufferLayout.u8('isInitialized'),
  BufferLayout.blob(32, 'htMint'),
  BufferLayout.blob(32, 'bettingUsdt'),
  BufferLayout.blob(32, 'poolUsdt'),
  BufferLayout.blob(1, 'frozenPool'),
]);

export interface HPState {
  isInitialized: boolean;
  htMint: String;
  bettingUsdt: String;
  poolUsdt: String;
  frozenPool: boolean;
}

export const HPStateParser = (id: PublicKey, acc: AccountInfo<Buffer>): ParsedAccount<HPState> => {
  const decoded = HP_STATE_LAYOUT.decode(acc.data) as any;
  const hpstate: ParsedAccount<HPState> = {
    pubkey: id,
    account: { ...acc },
    info: {
      isInitialized: decoded.isInitialized,
      htMint: new PublicKey(decoded.htMint).toString(),
      bettingUsdt: new PublicKey(decoded.bettingUsdt).toString(),
      poolUsdt: new PublicKey(decoded.poolUsdt).toString(),
      frozenPool: decoded.frozenPool,
    }
  };
  return hpstate;
}