import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { PublicKey, Keypair } from "@solana/web3.js";

export const createNewToken = async (
    feePayer: Keypair,
    mintAuthority: string,
    freezeAuthority: string,
    decimals: number,
    connection: any
) => {

    const token = await Token.createMint(
        connection,
        feePayer,
        new PublicKey(mintAuthority),
        freezeAuthority ? new PublicKey(freezeAuthority) : null,
        decimals,
        TOKEN_PROGRAM_ID
    );
    return token.publicKey.toString();
};