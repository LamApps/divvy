const { Account, Cluster, clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } = require("@solana/web3.js");
const { struct, nu64, u8, blob } = require("buffer-layout");
const fs = require('fs');
const path = require("path");
const divvyAccount = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(path.resolve("./divvy.json"), 'utf-8'))), { skipValidation: true });
const BUST_STATE_ACCOUNT_DATA_LAYOUT = struct([
    blob(32, "currentPubkey"),
    blob(32, "previousPubkey"),
    blob(4, "currentMultiplier"),
    blob(4, "previousMultiplier"),
]);
const USDT_MINT = new PublicKey("7cnY6yuFXzTLEsnXn4FkgvmXq4FyuUakQDQqHJkbQvYG")

exports.USDT_MINT = USDT_MINT;
exports.divvyAccount = divvyAccount;
exports.BUST_STATE_ACCOUNT_DATA_LAYOUT = BUST_STATE_ACCOUNT_DATA_LAYOUT;
    