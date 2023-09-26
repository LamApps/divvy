import {CommonResponse} from "./common";

export interface BustBet {
    risk: number,
    userPubkey: string,
    userUSDTPubkey: string,
    multiplier: number,
    payout: number,
    status: number,
    placedOn: string
}

export interface PostBetsResponse extends CommonResponse {
    bet: BustBet
}

export interface MultiplierGraphModel {
    multiplier: number,
    time: number
}
