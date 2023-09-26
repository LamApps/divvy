const { Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { Keypair, PublicKey } = require("@solana/web3.js");

const createTokenAccount = async (
    feePayer,
    tokenMintPubkey,
    owner,
    connection
) => {
    const ownerPubkey = new PublicKey(owner);
    const token = new Token(
        connection,
        tokenMintPubkey,
        TOKEN_PROGRAM_ID,
        feePayer
    );

    return (await token.createAccount(ownerPubkey))
};

exports.createTokenAccount = createTokenAccount;