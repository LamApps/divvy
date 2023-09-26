const { Account, Cluster, clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } = require("@solana/web3.js");
const { BUST_STATE_ACCOUNT_DATA_LAYOUT, divvyAccount } = require("./constants");

const PROGRAM_ID = new PublicKey("J3694SWb8H47QkbqmMGDrSpccZFQiBuryHKjrYU42Ree");

const createBustAccount = async (connection) => {
    const BUST_ACCOUNT = Keypair.generate();
    const ix = SystemProgram.createAccount({
        space: BUST_STATE_ACCOUNT_DATA_LAYOUT.span,
        lamports: await connection.getMinimumBalanceForRentExemption(BUST_STATE_ACCOUNT_DATA_LAYOUT.span, 'singleGossip'),
        fromPubkey: divvyAccount.publicKey,
        newAccountPubkey: BUST_ACCOUNT.publicKey,
        programId: PROGRAM_ID
    });
    return [BUST_ACCOUNT, ix];
}

exports.createBustAccount = createBustAccount;
exports.PROGRAM_ID = PROGRAM_ID;