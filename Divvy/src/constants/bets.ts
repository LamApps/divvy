export enum BetStatus {
    Current = 0,
    Pending = 1,
    Graded = 2
}
export interface Team {
    name: string,
    logo: string,
    homeTeam: boolean
}
export interface Odds {
    moneyline: number,
    spread: number,
    spreadPoints: number,
    total: number,
    totalPoints: number,
    moneylineFeedPubkey: string,
    spreadPointsFeedPubkey: string,
    spreadFeedPubkey: string,
    totalFeedPubkey: string,
    totalPointsFeedPubkey: string,
}
export enum BetType {
    moneyline = "Money Line",
    spread = "Spread",
    total = "Over/Under",
}
export enum MarketSide {
    teamA = "teamA",
    teamB = "teamB",
    draw = "draw"
}
// eslint-disable-next-line @typescript-eslint/no-redeclare
export namespace MarketSide {
    export function toIndex(marketSide: MarketSide): number {
        return marketSide === MarketSide.teamA ? 0 :
            marketSide === MarketSide.teamB ? 1 :
                marketSide === MarketSide.draw ? 2 :
                    -1;
        ;
    }
    export function fromIndex(index: number): MarketSide {
        return index === 0 ? MarketSide.teamA :
            index === 1 ? MarketSide.teamB :
                index === 2 ? MarketSide.draw :
                    MarketSide.teamA;
    }
}
export interface Seasons {

}
export interface Season {
    season: {
        seasonId: number,
        sportId: number,
        seasonName: string,
        seasonActive: number
    },
    markets: Market[],
}
export interface Market {
    marketId: number,
    seasonId: number,
    sportId: number,
    seasonName: string,
    sportName: string,
    marketName: string,
    oddsApiId: string,
    lastUpdated: number,
    active: number,
    teamA: string,
    teamB: string,
    draw: string,
    homeTeam: string,
    favoriteTeam: string,
    commenceTime: number,
    endTime: number,
    winner: number,
    winnerFeedPubkey: string,
    teamAOddsMoneyline: number,
    teamAOddsMoneylineFeedPubkey: string,
    teamBOddsMoneyline: number,
    teamBOddsMoneylineFeedPubkey: string,
    drawOddsMoneyline: number,
    drawOddsMoneylineFeedPubkey: string,
    teamATotalPoints: number,
    teamATotalPointsFeedPubkey: string,
    teamBTotalPoints: number,
    teamBTotalPointsFeedPubkey: string,
    drawTotalPoints: number,
    drawTotalPointsFeedPubkey: string,
    teamAOddsTotal: number,
    teamAOddsTotalFeedPubkey: string,
    teamBOddsTotal: number,
    teamBOddsTotalFeedPubkey: string,
    drawOddsTotal: number,
    drawOddsTotalFeedPubkey: string,
    teamASpreadPoints: number,
    teamASpreadPointsFeedPubkey: string,
    teamBSpreadPoints: number,
    teamBSpreadPointsFeedPubkey: string,
    drawSpreadPoints: number,
    drawSpreadPointsFeedPubkey: string,
    teamAOddsSpread: number,
    teamAOddsSpreadFeedPubkey: string,
    teamBOddsSpread: number,
    teamBOddsSpreadFeedPubkey: string,
    drawOddsSpread: number,
    drawOddsSpreadFeedPubkey: string,
    teamAScore: number,
    teamAScoreFeedPubkey: string,
    teamBScore: number,
    teamBScoreFeedPubkey: string,
    moneylineMarketPubkey: string,
    totalMarketPubkey: string,
    spreadMarketPubKey: string
}
export interface Bet {
    betId: number,
    marketId: number,
    seasonId: number,
    sportId: number,
    marketPubkey: string,
    risk: number,
    payout: number,
    userPubkey: string,
    selection: string,
    odds: number
    status: BetStatus,
    market: Market,
    oddsPubKey: string
    betPubkey?: string
    selectionTeam: string,
    otherTeam: string,
    marketSide: MarketSide,
    betType: BetType,
    seasonName?: string,
    sportName?: string,
    marketName?: string,
    placedOn?: string,
    points: number,
    teamASpreadPoints?: number,
    teamBSpreadPoints?: number,
    teamATotalPoints?: number,
    teamBTotalPoints?: number,
    lockedLiquidity?: string,
    availableLiquidity?: string,
    htTokensBalance?: string,
    htPrice?: string
}

export interface BetsTable {
    key: number,
    type: string,
    match: string,
    sport: string,
    placed: string,
    settled: string,
    odds: string,
    bettype: string,
    wager: string,
    potential: string,
    time: string
}

export interface Pool {
    id: number,
    day: string,
    balance: number,
    earning: number,
    volume: number
}

export interface PoolGraph {
    date: string,
    performance: number
}

export interface Transactions {
    id?: number,
    type: string,
    pubkey?: string,
    match: string,
    odds: string,
    odds_type: string,
    amount: number,
    time?: string
}

export interface TransactionsTable {
    key: number,
    type: string,
    pubkey: string,
    match: string,
    odds: string,
    amount: string
}

export const getBetType = (betType: BetType) => {
    switch (betType) {
        case BetType.moneyline:
            return 0;

        case BetType.spread:
            return 1;

        case BetType.total:
            return 2;
    }
}