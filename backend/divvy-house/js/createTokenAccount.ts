import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js";

export const createTokenAccount = async (
    feePayer: Keypair,
    tokenMintPubkey: PublicKey,
    ownerPubkey: PublicKey,
    connection: any
) => {
    const token = new Token(
        connection,
        tokenMintPubkey,
        TOKEN_PROGRAM_ID,
        feePayer
    );

    return (await token.createAccount(ownerPubkey))
};