import { AccountInfo, PublicKey } from "@solana/web3.js";
import { nu64, u8 } from "buffer-layout";
import { ParsedAccount } from "../../../contexts/sol/accounts";
import { u64 } from "../../../utils/layout";
const { struct, blob } = require("buffer-layout");
const bool = (property = "bool") => {
    return blob(1, property);
};

/**
 * Layout for a 64bit unsigned value
 */
const uint64 = (property = "uint64") => {
    return blob(8, property);
};

const LAYOUT = struct([
    u8("isInitialized"),
    nu64("lockedLiquidity"),
    nu64("liveLiquidity"),
    nu64("pendingBets"),
    blob(32, "housePoolUsdt"),
    blob(32, "bettingPoolUsdt"),
    blob(32, "insuranceFundUsdt"),
    blob(32, "divvyFoundationProceedsUsdt"),
    u8("frozenBetting"),
]);

export interface BetState {
    isInitialized: boolean
    lockedLiquidity: number
    liveLiquidity: number
    pendingBets: number
    housePoolUsdt: String
    bettingPoolUsdt: String
    insuranceFundUsdt: String
    divvyFoundationProceedsUsdt: String
    frozenBetting: boolean
}

export const BetStateParser = (id: PublicKey, acc: AccountInfo<Buffer>): ParsedAccount<BetState> => {
    const decoded = LAYOUT.decode(acc.data) as any;
    // console.log(decoded, 'betstate')
    const betstate: ParsedAccount<BetState> = {
        pubkey: id,
        account: { ...acc },
        info: {
            isInitialized: decoded.isInitialized,
            lockedLiquidity: decoded.lockedLiquidity,
            liveLiquidity: decoded.liveLiquidity,
            pendingBets: decoded.pendingBets,
            housePoolUsdt: new PublicKey(decoded.housePoolUsdt).toString(),
            bettingPoolUsdt: new PublicKey(decoded.bettingPoolUsdt).toString(),
            insuranceFundUsdt: new  PublicKey(decoded.insuranceFundUsdt).toString(),
            divvyFoundationProceedsUsdt: new PublicKey(decoded.divvyFoundationProceedsUsdt).toString(),
            frozenBetting: decoded.frozenBetting,
        }
    };
    return betstate;
}