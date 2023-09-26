import { AccountInfo, PublicKey } from "@solana/web3.js";
import * as Layout from "../../../utils/layout";
import * as BufferLayout from "buffer-layout";
import { ParsedAccount } from "../../../contexts/sol/accounts";
import { MarketSide } from "../../../constants";

export const MONEY_LINE_BET_LAYOUT = BufferLayout.struct([
  BufferLayout.u8('isInitialized'),
  Layout.publicKey('market'),
  Layout.publicKey('userUsdtAccount'),
  Layout.publicKey('userAccount'),
  BufferLayout.nu64('risk'),
  BufferLayout.nu64('payout'),
  BufferLayout.u16('points'),
  BufferLayout.u8('marketSide'),
  BufferLayout.u8('outcome'),
  BufferLayout.u8('betType')
]);

export interface MoneyLineBet {
  isInitialized: boolean;
  market: PublicKey;
  userUsdtAccount: PublicKey;
  userAccount: PublicKey;
  risk: number;
  payout: number;
  marketSide: MarketSide;
  outcome: number;
}

export const MoneyLineBetParser = (id: PublicKey, acc: AccountInfo<Buffer>): ParsedAccount<MoneyLineBet> => {
  const decoded = MONEY_LINE_BET_LAYOUT.decode(acc.data) as any;
  const moneyLineBet: ParsedAccount<MoneyLineBet> = {
    pubkey: id,
    account: { ...acc },
    info: {
      isInitialized: !!decoded.isInitialized,
      market: new PublicKey(decoded.market),
      userUsdtAccount: new PublicKey(decoded.userUsdtAccount),
      userAccount: new PublicKey(decoded.userAccount),
      risk: decoded.risk,
      payout: decoded.payout,
      marketSide: MarketSide.fromIndex(decoded.marketSide),
      outcome: decoded.outcome,
    }
  };
  return moneyLineBet;
}

export const ESCROW_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  Layout.publicKey("initializerPubkey"),
  Layout.publicKey("initializerTempTokenAccountPubkey"),
  Layout.publicKey("initializerReceivingTokenAccountPubkey"),
  Layout.u64("expectedAmount"),
]);

export interface EscrowLayout {
  isInitialized: number,
  initializerPubkey: Uint8Array,
  initializerReceivingTokenAccountPubkey: Uint8Array,
  initializerTempTokenAccountPubkey: Uint8Array,
  expectedAmount: Uint8Array
}