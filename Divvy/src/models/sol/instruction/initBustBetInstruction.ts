import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import * as BufferLayout from "buffer-layout";
import { Bet, BetStatus, decimalToAmerican, getBetType, MarketSide, Transactions } from "../../../constants";
import { ENV } from "../../../constants/sol/env";
import { sendTransaction } from "../../../contexts/sol/connection";
import { WalletAdapter } from "../../../contexts/sol/wallet";
import * as IDS from "../../../utils/ids"
import { notify } from "../../../utils/notifications";
import { BustBet } from "../../games/moonshot/bets";
import { BUST_BET_ACCOUNT } from "../state/bustState";

const INIT_BET_LAYOUT: BufferLayout.Layout = BufferLayout.struct([
  BufferLayout.u8("action"),
  BufferLayout.nu64("risk"),
]);

interface INIT_BUST_BET_DATA {
  action: number;
  risk: number;
  multiplier: number;
};

export const initBustBet = async (
  connection: Connection,
  env: ENV,
  wallet: WalletAdapter | undefined,
  userUsdtAccount: PublicKey | undefined,
  bet: BustBet): Promise<[ok: boolean, txid: string | undefined]> => {

  const walletPubkey = wallet?.publicKey;

  if (wallet == null || walletPubkey == null) {
    notify({
      message: "Transaction failed...",
      description: "Please connect a wallet.",
      type: "error",
    });
    return [false, undefined];
  }

  if (userUsdtAccount == null) {
    notify({
      message: "Transaction failed...",
      description: "User does not have a USDC token account.",
      type: "error",
    });
    return [false, undefined];
  }

  const ixs: TransactionInstruction[] = [];
  const betAccounts: Keypair[] = [];

  const betAccountRent = await connection.getMinimumBalanceForRentExemption(BUST_BET_ACCOUNT.span, 'singleGossip');
  let metaData: Array<Transactions> = new Array<Transactions>();
    const [ix, betAccount] = await initBustBetTransaction(
      walletPubkey,
      userUsdtAccount,
      bet.risk,
      betAccountRent,
      decimalToAmerican(bet.multiplier)
      );
    ixs.push(...ix);
    betAccounts.push(betAccount);
    metaData.push({
      type: "Bet Placed",
      match: "",
      odds: String(bet.multiplier),
      odds_type: "Moon Shot",
      amount: bet.risk
    });
  let txn = await sendTransaction(connection, env, wallet, ixs, metaData, betAccounts);
  let [ok,] = txn;

  if (ok) {
      bet.status = BetStatus.Pending
      bet.userPubkey = walletPubkey.toBase58()
  }
  return txn;
}

export const initBustBetTransaction = async (
  userAccount: PublicKey,
  userUsdtAccount: PublicKey,
  riskedUsdt: number,
  betAccountRent: number, multiplier: number): Promise<[tx: TransactionInstruction[], betAccount: Keypair]> => {

  const betAccount = Keypair.generate();
  const createTempTokenAccountIx = await createBetAccountInstruction(
    userAccount,
    betAccount.publicKey,
    betAccountRent);
  const initBustBetIx = await initBustBetInstruction(
    userAccount,
    userUsdtAccount,
    betAccount.publicKey,
    riskedUsdt,
    multiplier);
  const ix = [createTempTokenAccountIx, initBustBetIx];

  return [ix, betAccount];
}

const createBetAccountInstruction = async (fromPubkey: PublicKey, betAccountPubkey: PublicKey, rent: number) => {
  const createTempTokenAccountIx = SystemProgram.createAccount({
    programId: IDS.BET_POOL_PROGRAM_ID,
    space: BUST_BET_ACCOUNT.span,
    lamports: rent,
    fromPubkey: fromPubkey,
    newAccountPubkey: betAccountPubkey
  });
  return createTempTokenAccountIx;
}

const initBustBetInstruction = async (
  userAccount: PublicKey,
  userUsdtAccount: PublicKey,
  bustBetAccount: PublicKey,
  riskedUsdt: number,
  userMultplier: number,
  ) => {
    const initBustBetData: INIT_BUST_BET_DATA = {
    action: 0,
    risk: riskedUsdt,
    multiplier: userMultplier,
  };

  const initBustBetBuffer = Buffer.alloc(INIT_BET_LAYOUT.span);
  INIT_BET_LAYOUT.encode(initBustBetData, initBustBetBuffer)
  const initBustBetIx = new TransactionInstruction({
    keys: [
      { pubkey: IDS.BUST_ACCOUNT, isSigner: false, isWritable: true },
      { pubkey: bustBetAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: IDS.BET_POOL_USDC_ACCOUNT, isSigner: false, isWritable: true },
      { pubkey: userUsdtAccount, isSigner: false, isWritable: true },
      { pubkey: userAccount, isSigner: true, isWritable: true },
    ],
    data: initBustBetBuffer,
    programId: IDS.BET_POOL_PROGRAM_ID
  });

  return initBustBetIx;
}
