import { AccountInfo, PublicKey } from "@solana/web3.js";
import { decode } from "bs58";
import * as BufferLayout from "buffer-layout";
import { ParsedAccount } from "../../../contexts/sol/accounts";

export const MINT_LAYOUT = BufferLayout.struct([
    BufferLayout.u32('mintAuthorityOption'),
    BufferLayout.blob(32, 'mintAuthority'),
    BufferLayout.nu64('supply'),
    BufferLayout.u8('decimals'),
    BufferLayout.u8('isInitialized'),
    BufferLayout.u32('freezeAuthorityOption'),
    BufferLayout.blob(32, 'freezeAuthority'),
]);
export interface MintState {
    mintAuthority: null | PublicKey,
    supply: number,
    decimals: number,
    isInitialized: boolean,
    freezeAuthority: null | PublicKey,
}

export const MintStateParser = (id: PublicKey, acc: AccountInfo<Buffer>): ParsedAccount<MintState> => {
    const decoded = MINT_LAYOUT.decode(acc.data) as any;
    // console.log(acc);
    const mintState: ParsedAccount<MintState> = {
        pubkey: id,
        account: { ...acc },
        info: {
            mintAuthority: decoded.mintAuthority,
            supply: decoded.supply,
            decimals: decoded.decimals,
            isInitialized: decoded.isInitialized,
            freezeAuthority: decoded.freezeAuthority
        }
    };
    return mintState;
}