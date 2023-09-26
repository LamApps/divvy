import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { createTokenAccount } from "./createTokenAccount";
import fs from 'fs'
import path from "path";
import { toCluster } from "./init";
const payerAccount = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(path.resolve("../divvy.json"), 'utf-8'))), { skipValidation: true })
const DIVVY_PROGRAM_ID = new PublicKey("GWYmzg8M2QBH1ShezcQuFNhtxHhssSMCRrNviLs6wQyL")
const USDT_MINT = new PublicKey("7cnY6yuFXzTLEsnXn4FkgvmXq4FyuUakQDQqHJkbQvYG")

const main = async () => {
    let cluster = 'devnet';
    let url = clusterApiUrl(toCluster(cluster), true);
    let connection = new Connection(url, 'processed');
    const [pda, bumpSeed] = await PublicKey.findProgramAddress([Buffer.from("divvybetting")], DIVVY_PROGRAM_ID);
    const bet_pool_usdt_account = await createTokenAccount(payerAccount, USDT_MINT, pda.toString(), connection)
    console.log("Bet USDT ACCOUNT:", bet_pool_usdt_account.toString());
}
main()