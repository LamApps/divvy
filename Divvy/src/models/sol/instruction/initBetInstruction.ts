import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import * as BufferLayout from "buffer-layout";
import { Bet, BetStatus, getBetType, MarketSide, Transactions } from "../../../constants";
import { ENV } from "../../../constants/sol/env";
import { sendTransaction } from "../../../contexts/sol/connection";
import { WalletAdapter } from "../../../contexts/sol/wallet";
import * as IDS from "../../../utils/ids"
import { notify } from "../../../utils/notifications";
import { MONEY_LINE_BET_LAYOUT } from "../state/moneyLineBet";

const INIT_BET_LAYOUT: BufferLayout.Layout = BufferLayout.struct([
  BufferLayout.u8("action"),
  BufferLayout.nu64("risk"),
  BufferLayout.u16("points"),
  BufferLayout.nu64("odds"),
  BufferLayout.u8("marketSide"),
  BufferLayout.u8("betType"),
  BufferLayout.u8("bumpSeed"),
]);

interface INIT_BET_DATA {
  action: number;
  risk: number;
  points: number,
  odds: number;
  marketSide: number;
  betType: number,
  bumpSeed: number;
};

export const initBet = async (
  connection: Connection,
  env: ENV,
  wallet: WalletAdapter | undefined,
  userUsdtAccount: PublicKey | undefined,
  bets: Bet[]): Promise<[ok: boolean, txid: string | undefined]> => {

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

  const betAccountRent = await connection.getMinimumBalanceForRentExemption(MONEY_LINE_BET_LAYOUT.span, 'singleGossip');
  let metaData: Array<Transactions> = new Array<Transactions>();
  console.log("bets", bets)
  for (const bet of bets) {
    const [ix, betAccount] = await initBetTransaction(
      walletPubkey,
      userUsdtAccount,
      bet.marketSide,
      bet.risk,
      bet.odds,
      new PublicKey(bet.marketPubkey),
      new PublicKey(bet.oddsPubKey),
      betAccountRent, bet.points, getBetType(bet.betType));
    ixs.push(...ix);
    betAccounts.push(betAccount);
    metaData.push({
      type: "Bet Placed",
      match: bet.market.teamA+"  VS "+bet.market.teamB,
      odds: String(bet.odds),
      odds_type: bet.betType,
      amount: bet.risk
    });
  }
  let txn = await sendTransaction(connection, env, wallet, ixs, metaData, betAccounts);
  let [ok,] = txn;

  if (ok) {
    bets.forEach((bet, index) => {
      const betAccount = betAccounts[index];
      bet.betPubkey = betAccount.publicKey.toBase58();
      bet.status = BetStatus.Pending
      bet.userPubkey = walletPubkey.toBase58()
    })
  }
  return txn;
}

export const initBetTransaction = async (
  userAccount: PublicKey,
  userUsdtAccount: PublicKey,
  marketSide: MarketSide,
  riskedUsdt: number,
  odds: number,
  marketPubkey: PublicKey,
  oddsFeed: PublicKey,
  betAccountRent: number, points: number, betType: number): Promise<[tx: TransactionInstruction[], betAccount: Keypair]> => {

  const betAccount = Keypair.generate();
  const createTempTokenAccountIx = await createBetAccountInstruction(
    userAccount,
    betAccount.publicKey,
    betAccountRent);
  const initBetIx = await initBetInstruction(
    userAccount,
    userUsdtAccount,
    oddsFeed,
    betAccount.publicKey,
    marketPubkey,
    riskedUsdt,
    odds,
    marketSide, points, betType);
  const ix = [createTempTokenAccountIx, initBetIx];

  return [ix, betAccount];
}

const createBetAccountInstruction = async (fromPubkey: PublicKey, betAccountPubkey: PublicKey, rent: number) => {
  const createTempTokenAccountIx = SystemProgram.createAccount({
    programId: IDS.BET_POOL_PROGRAM_ID,
    space: MONEY_LINE_BET_LAYOUT.span,
    lamports: rent,
    fromPubkey: fromPubkey,
    newAccountPubkey: betAccountPubkey
  });
  return createTempTokenAccountIx;
}

const initBetInstruction = async (
  userAccount: PublicKey,
  userUsdtAccount: PublicKey,
  oddsFeed: PublicKey,
  betAccount: PublicKey,
  marketAccount: PublicKey,
  riskedUsdt: number,
  odds: number,
  marketSide: MarketSide,
  points: number,
  betType: number,) => {
    const [, bumpSeed] = await PublicKey.findProgramAddress([Buffer.from("divvyhouse")], IDS.HOUSE_POOL_PROGRAM_ID);
    console.log(bumpSeed)
  const initBetData: INIT_BET_DATA = {
    action: 0,
    risk: riskedUsdt,
    points: points > 0 ? points * 100 : -points * 100,
    // sending mod of odds since we are just using switchboard odds. Should check later.
    odds: odds > 0 ? odds : -odds,
    marketSide: MarketSide.toIndex(marketSide),
    betType: betType,
    bumpSeed: bumpSeed
  };

  const initBetBuffer = Buffer.alloc(INIT_BET_LAYOUT.span);
  INIT_BET_LAYOUT.encode(initBetData, initBetBuffer)
  console.log("init betix",initBetData)
  const initBetIx = new TransactionInstruction({
    keys: [
      { pubkey: userAccount, isSigner: true, isWritable: true },
      { pubkey: oddsFeed, isSigner: false, isWritable: false },
      { pubkey: betAccount, isSigner: false, isWritable: true },
      { pubkey: marketAccount, isSigner: false, isWritable: true },
      { pubkey: IDS.BET_POOL_STATE_ACCOUNT, isSigner: false, isWritable: true },
      { pubkey: IDS.HOUSE_POOL_USDC_ACCOUNT, isSigner: false, isWritable: true },
      { pubkey: IDS.BET_POOL_USDC_ACCOUNT, isSigner: false, isWritable: true },
      { pubkey: userUsdtAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: IDS.HOUSE_POOL_PDA_ACCOUNT, isSigner: false, isWritable: true },
      { pubkey: IDS.BET_POOL_PDA_ACCOUNT, isSigner: false, isWritable: true },
      { pubkey: IDS.HOUSE_POOL_STATE_ACCOUNT, isSigner: false, isWritable: true },
      { pubkey: IDS.HOUSE_POOL_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: initBetBuffer,
    programId: IDS.BET_POOL_PROGRAM_ID
  });

  return initBetIx;
}
