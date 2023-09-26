import { Account, Cluster, clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
const { struct, nu64, u8, blob } = require("buffer-layout");
import fs from 'fs'
import path from "path";
import { createNewToken } from "./createToken";
import { createTokenAccount } from "./createTokenAccount";
export const DIVVY_PROGRAM_ID = new PublicKey("AGetrKU8hVdHEEzisekqPuer1ALHLG2jp5RkgTWKs2hC")
export const payerAccount = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(path.resolve("../divvy.json"), 'utf-8'))), { skipValidation: true })
const bool = (property = "bool") => {
    return blob(1, property);
};
/*
Token Account
SOL Balance: 0.00203928 SOL ($0.29277942)
SPL Token Address: 7cnY6yuFXzTLEsnXn4FkgvmXq4FyuUakQDQqHJkbQvYG
SPL Token Name: Unrecognized Token
Balance: 861,013.46
*/
const bet_usdt_account = new PublicKey("Fj9Q9y5NY84NWU11m4AgR17ybSYsZoiPMa2HEWS7oWMi") 
/*
Max: Total Supply 18,251,002.00
Holders: 427
Social: Channels

Token name: Unrecognized Token
Token address: 7cnY6yuFXzTLEsnXn4FkgvmXq4FyuUakQDQqHJkbQvYGicon
Owner Program: Token Program
Authority: Fx1bCAyYpLMPVAjfq1pxbqKKkvDR3iYEpam1KbThRDYQ (Account)
Decimals: 6
*/
const usdt = new PublicKey("7cnY6yuFXzTLEsnXn4FkgvmXq4FyuUakQDQqHJkbQvYG")
/*
Max: Total Supply 1,910,280.62
Holders: 55
Social: Channels

Token name: Unrecognized Token
Token address: AJDAS949LedZFV5jEaoaQQRnziaYTYnSsEhCsfnfsxeJ
Owner Program: Token Program
Authority: 5tqXcnJgyJY5axjL7BjPeT1GAibqH3aicUi86wf9zmFC (Account)
Decimals: 6
*/
const ht_mint = new PublicKey("AJDAS949LedZFV5jEaoaQQRnziaYTYnSsEhCsfnfsxeJ")
/**
 * Layout for a 64bit unsigned value
 */
const uint64 = (property = "uint64") => {
    return blob(8, property);
};
export const STATE_ACCOUNT_DATA_LAYOUT = struct([
    bool("isInitialized"),
    blob(32, "htMint"),
    blob(32, "bettingUsdt"),
    blob(32, "poolUsdt"),
    bool("frozenPool"),
]);
const INIT_PROGRAM_LAYOUT = struct([
    u8("action"),
    u8("divvyPdaBumpSeed")
])
interface InitProgramData {
    action: number,
    divvyPdaBumpSeed: number
};

function toCluster(cluster: string): Cluster {
    switch (cluster) {
        case "devnet":
        case "testnet":
        case "mainnet-beta": {
            return cluster;
        }
    }
    throw new Error("Invalid cluster provided.");
}
export let cluster = 'devnet';
export let url = clusterApiUrl(toCluster(cluster), true);
export let connection = new Connection(url, 'processed');

const main = async () => {
    const [pda, bumpSeed] = await PublicKey.findProgramAddress([Buffer.from("divvyhouse1")], DIVVY_PROGRAM_ID);
    console.log(bumpSeed)
    console.log("PDA", pda.toString())

    const hp_state_account = Keypair.generate();
    console.log("Divvy HP state account " + hp_state_account.publicKey.toString())

    const data: InitProgramData = {
        action: 2,
        divvyPdaBumpSeed: bumpSeed
    };
    const create_hp_state = await SystemProgram.createAccount({
        space: STATE_ACCOUNT_DATA_LAYOUT.span,
        lamports: await connection.getMinimumBalanceForRentExemption(STATE_ACCOUNT_DATA_LAYOUT.span, 'singleGossip'),
        fromPubkey: payerAccount.publicKey,
        newAccountPubkey: hp_state_account.publicKey,
        programId: DIVVY_PROGRAM_ID
    });

    const pool_usdt_account = await createTokenAccount(payerAccount, usdt, pda, connection)
    console.log("HP USDT ACCOUNT:", pool_usdt_account.toString());
    const dataBuffer = Buffer.alloc(INIT_PROGRAM_LAYOUT.span);
    INIT_PROGRAM_LAYOUT.encode(data, dataBuffer);
    const initProgramInstruction = new TransactionInstruction({
        keys: [
            { pubkey: payerAccount.publicKey, isSigner: true, isWritable: true },
            { pubkey: hp_state_account.publicKey, isSigner: false, isWritable: true },
            { pubkey: ht_mint, isSigner: false, isWritable: true },
            { pubkey: bet_usdt_account, isSigner: false, isWritable: true },
            { pubkey: pool_usdt_account, isSigner: false, isWritable: true },
        ],
        programId: DIVVY_PROGRAM_ID,
        data: dataBuffer,
    });

    console.log("Awaiting transaction confirmation...");

    let signature = await sendAndConfirmTransaction(connection, new Transaction().add(create_hp_state).add(initProgramInstruction), [
        payerAccount, hp_state_account
    ]);

    console.log(`https://explorer.solana.com/tx/${signature}?cluster=${cluster}`);
}
main()