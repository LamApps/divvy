import { useState, createContext } from "react"
import { Bet, BetStatus, BetType, MarketSide } from "../constants";
import { useAccountByMint } from "../hooks";
import { useConnection, useConnectionConfig } from "./sol/connection";
import { useWallet } from "./sol/wallet";
import { initBet } from "../models/sol/instruction/initBetInstruction";
import * as IDS from "../utils/ids"
import { useGetBetsQuery } from "../store/getBets";
import { americanToDecimal, tokenAmountToString } from "../constants";
import { useStoreBetsMutation } from "../store/storeBets";

export const BetsContext = createContext<{
  bets: Bet[],
  addBet: (bet: Bet) => void,
  addBets: (bets: Array<Bet>) => void,
  removeBet: (betId: number) => void,
  findBets: (marketId: number, marketSide: MarketSide, betType: BetType, betStatus: BetStatus) => Bet[],
  containsBet: (marketId: number, marketSide: MarketSide, betType: BetType, betStatus: BetStatus) => boolean,
  editBetRisk: (betId: number, risk: number) => void,
  placeBetSlip: () => Promise<void>,
} | null>(null);


const BetsProvider = (props: { children: any }) => {
  const [bets, setBets] = useState(Array<Bet>());
  const { connected, connect, select, provider } = useWallet();
  const wallet = useWallet();
  const connection = useConnection();
  const connectionConfig = useConnectionConfig();
  const usdcTokenAccount = useAccountByMint(IDS.getUsdtMint(connectionConfig.env));
  const { data, error, isLoading } = useGetBetsQuery(wallet?.publicKey?.toString())
  const [
    storeBet, // This is the mutation trigger
    { isLoading: isUpdating }, // This is the destructured mutation result
  ] = useStoreBetsMutation()


  const addBet = (betSlip: Bet) => {
    let bet: Array<Bet> = [];
    var b: Bet;
    data?.forEach((value: Bet) => {
      b = value
      switch (b.status) {
        case BetStatus.Pending:
          bet.push(b)
      }
    })
    bets?.forEach((b) => {
      if (b["status"] === BetStatus.Current) {
        bet.push(b)
      }
      if (b['status'] === BetStatus.Pending) {
        const idx = bet.findIndex(item => { return b.marketSide === item.marketSide && b.marketId === item.marketId});
        if (idx === -1) bet.push(b)
      }
    })
    bet.push(betSlip)
    setBets(bet)
  }

  const addBets = (betSlips: Array<Bet>) => {
    setBets(betSlips)
  }

  const removeBet = (betId: number) => {
    var newBets: Array<Bet> = [];
    bets.forEach((value: Bet) => {
      if (value.betId !== betId) {
        newBets.push(value)
      }
    })
    setBets(newBets)
  }
  const findBets = (marketId: number, marketSide: MarketSide, betType: BetType, betStatus: BetStatus) => {
    return bets.filter(bet => bet.marketId === marketId && bet.marketSide === marketSide && bet.betType === betType && bet.status === betStatus);
  }
  const containsBet = (marketId: number, marketSide: MarketSide, betType: BetType, betStatus: BetStatus) => {
    return findBets(marketId,marketSide,betType,betStatus).length > 0;
  }
  const editBetRisk = (betId: number, amount: number) => {
    var bet: Bet;
    var newBets: Array<Bet> = [];
    bets.forEach((value: Bet) => {
      if (value.betId === betId) {
        bet = value
        bet.risk = amount;
        newBets.push(bet)
      }
      else {
        newBets.push(value)
      }
    })
    setBets(newBets)
  }
  const placeBetSlip = async () => {
    const currentBets = bets.filter(bet=> bet.status === BetStatus.Current);
    // TODO: Check behaviour for first time users 
    if(!connected){
      connect();
    }
    if(currentBets.length > 0){

      // Chunk bets into 2s
      // Transactions have a limit of 1232 bytes
      // We hit the limit above 2 bets
      // https://github.com/solana-labs/solana/issues/17102 tracks the transaction limit
      const perChunk = 2;
      var betChunks = currentBets.reduce((resultArray: any, item, index) => { 
        const chunkIndex = Math.floor(index/perChunk)
        if(!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [] // start a new chunk
        }
      
        resultArray[chunkIndex].push(item)
      
        return resultArray
      }, []) as Bet[][];

      for(const betChunk of betChunks) {
        const [ok,] = await initBet(
          connection,
          connectionConfig.env,
          wallet.wallet,
          usdcTokenAccount?.pubkey,
          betChunk);
        if (ok && wallet.publicKey) {
          for(const bet of betChunk) {
            bet.payout = JSON.parse(tokenAmountToString(bet.risk * bet.odds).replace(",", ""));
            bet.teamASpreadPoints = bet.market.teamASpreadPoints;
            bet.teamBSpreadPoints = bet.market.teamBSpreadPoints;
            bet.teamATotalPoints = bet.market.teamATotalPoints;
            bet.teamBTotalPoints = bet.market.teamBTotalPoints;
            storeBet(bet)
          }
        }
      }
    }
    setBets([...bets])
  }

  return (
    <BetsContext.Provider value={{
      bets: bets,
      addBet: addBet,
      addBets: addBets,
      removeBet: removeBet,
      findBets: findBets,
      containsBet: containsBet,
      editBetRisk: editBetRisk,
      placeBetSlip: placeBetSlip,
    }}>
      {props.children}
    </BetsContext.Provider>
  )
}
export default BetsProvider
