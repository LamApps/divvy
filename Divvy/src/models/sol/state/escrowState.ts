import { AccountInfo, PublicKey } from "@solana/web3.js";
import * as Layout from "../../../utils/layout";
import * as BufferLayout from "buffer-layout";
import { ParsedAccount } from "../../../contexts/sol/accounts";

const LAYOUT = BufferLayout.struct([
  BufferLayout.u8('isInitialized'),
  Layout.publicKey('initializerPubkey'),
  Layout.publicKey('tempTokenAccountPubkey'),
  Layout.publicKey('initializerTokenToReceiveAccountPubkey'),
  BufferLayout.nu64('expectedAmount'),
]);

export interface EscrowState {
  isInitialized: boolean;
  initializerPubkey: PublicKey;
  tempTokenAccountPubkey: PublicKey;
  initializerTokenToReceiveAccountPubkey: PublicKey;
  expectedAmount: number;
}

export const EscrowStateParser = (id: PublicKey, acc: AccountInfo<Buffer>): ParsedAccount<EscrowState> => {
  const decoded = LAYOUT.decode(acc.data) as any;
  const escrow: ParsedAccount<EscrowState> = {
    pubkey: id,
    account: { ...acc },
    info: {
      isInitialized: !!decoded.isInitialized,
      initializerPubkey: new PublicKey(decoded.initializerPubkey),
      tempTokenAccountPubkey: new PublicKey(decoded.tempTokenAccountPubkey),
      initializerTokenToReceiveAccountPubkey: new PublicKey(decoded.initializerTokenToReceiveAccountPubkey),
      ...decoded
    }
  };
  return escrow;
}