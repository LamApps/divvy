import { Account, Cluster, clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
const { struct, nu64, u8, blob } = require("buffer-layout");
import fs from 'fs'
import path from "path";
import { createTokenAccount } from "./createTokenAccount";
const DIVVY_PROGRAM_ID = new PublicKey("GWYmzg8M2QBH1ShezcQuFNhtxHhssSMCRrNviLs6wQyL")
const payerAccount = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(path.resolve("../divvy.json"), 'utf-8'))), { skipValidation: true })
const insuranceAccount = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(path.resolve("../insurance.json"), 'utf-8'))), { skipValidation: true })
const profitsAccount = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(path.resolve("../profits.json"), 'utf-8'))), { skipValidation: true })
const hp_usdt_account = new PublicKey("7rTAEWsdKFQP58oVu3YbbF38JV6P8daA4FnWhF3dFRBc");
const USDT_MINT = new PublicKey("7cnY6yuFXzTLEsnXn4FkgvmXq4FyuUakQDQqHJkbQvYG")
const bool = (property = "bool") => {
    return blob(1, property);
};

/**
 * Layout for a 64bit unsigned value
 */
const uint64 = (property = "uint64") => {
    return blob(8, property);
};

export const BET_STATE_ACCOUNT_DATA_LAYOUT = struct([
    blob(1,  "isInitialized"),
    blob(8, "lockedLiquidity"),
    blob(8,  "liveLiquidity"),
    blob(8, "pendingBets"),
    blob(32, "housePoolUsdt"),
    blob(32, "bettingPoolUsdt"),
    blob(32, "insuranceFundUsdt"),
    blob(32, "divvyFoundationProceedsUsdt"),
    bool("frozenBetting"),
]);

const INIT_PROGRAM_LAYOUT = struct([
    u8("action"),
    u8("divvyPdaBumpSeed")
])

interface InitProgramData {
    action: number,
    divvyPdaBumpSeed: number
};

export function toCluster(cluster: string): Cluster {
    switch (cluster) {
        case "devnet":
        case "testnet":
        case "mainnet-beta": {
            return cluster;
        }
    }
    throw new Error("Invalid cluster provided.");
}

const main = async () => {
    const [pda, bumpSeed] = await PublicKey.findProgramAddress([Buffer.from("divvybetting")], DIVVY_PROGRAM_ID);
    console.log(bumpSeed)
    console.log(pda.toString())
    let cluster = 'devnet';
    let url = clusterApiUrl(toCluster(cluster), true);
    let connection = new Connection(url, 'processed');
    console.log("PDA", pda.toString())

    const bet_pool_state_account = Keypair.generate();
    console.log("Divvy bet pool state account " + bet_pool_state_account.publicKey.toString())

    const data: InitProgramData = {
        action: 4,
        divvyPdaBumpSeed: bumpSeed
    };
    const create_bet_state = await SystemProgram.createAccount({
        space: BET_STATE_ACCOUNT_DATA_LAYOUT.span,
        lamports: await connection.getMinimumBalanceForRentExemption(BET_STATE_ACCOUNT_DATA_LAYOUT.span, 'singleGossip'),
        fromPubkey: payerAccount.publicKey,
        newAccountPubkey: bet_pool_state_account.publicKey,
        programId: DIVVY_PROGRAM_ID
    });

    const insuranceUSDTAccount = new PublicKey("7L61dLbMknWkNd5sKng9pU3P5sgeXDq15PP6KzRr8xUb")
    // await createTokenAccount(payerAccount, USDT_MINT, insuranceAccount.publicKey.toString(), connection)
    const profitsUSDTAccount = new PublicKey("4JGWpDEH75dTWe1nDeGQYaURajUR5EKMZTRtuSePaMwa")
    // await createTokenAccount(payerAccount, USDT_MINT, profitsAccount.publicKey.toString(), connection)
    const bet_pool_usdt_account = new PublicKey("Fj9Q9y5NY84NWU11m4AgR17ybSYsZoiPMa2HEWS7oWMi");
    // await createTokenAccount(payerAccount, USDT_MINT, pda.toString(), connection)
    // console.log("Bet USDT ACCOUNT:", bet_pool_usdt_account.toString());
    const dataBuffer = Buffer.alloc(INIT_PROGRAM_LAYOUT.span);
    INIT_PROGRAM_LAYOUT.encode(data, dataBuffer);
    const initProgramInstruction = new TransactionInstruction({
        keys: [
            { pubkey: payerAccount.publicKey, isSigner: true, isWritable: true },
            { pubkey: bet_pool_state_account.publicKey, isSigner: false, isWritable: true },
            { pubkey: hp_usdt_account, isSigner: false, isWritable: true },
            { pubkey: bet_pool_usdt_account, isSigner: false, isWritable: true },
            { pubkey: insuranceUSDTAccount, isSigner: false, isWritable: true },
            { pubkey: profitsUSDTAccount, isSigner: false, isWritable: true },

        ],
        programId: DIVVY_PROGRAM_ID,
        data: dataBuffer,
    });

    console.log("Awaiting transaction confirmation...");

    let signature = await sendAndConfirmTransaction(connection, new Transaction().add(create_bet_state).add(initProgramInstruction), [
        payerAccount, bet_pool_state_account
    ]);

    console.log(`https://explorer.solana.com/tx/${signature}?cluster=${cluster}`);
}
main()