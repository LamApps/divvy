const anchor = require("@project-serum/anchor");
const { Connection, PublicKey, Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");
const { divvyAccount, USDT_MINT } = require("./constants");
const { createBustAccount, PROGRAM_ID } = require("./createBustAccount");
const { createTokenAccount } = require("./createTokenAccount");

describe('divvy', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  it('Is initialized!', async () => {
    const program = anchor.workspace.Divvy;
    let [moon_shot_account, ix] = await createBustAccount(anchor.getProvider().connection);
    const [pda, bumpSeed] = await PublicKey.findProgramAddress([Buffer.from("divvy")], PROGRAM_ID);
    let bet_usdt_account = await createTokenAccount(divvyAccount, USDT_MINT, pda.toString(), anchor.getProvider().connection)
    let tx1 = await sendAndConfirmTransaction(anchor.getProvider().connection, new Transaction().add(ix), [ divvyAccount, moon_shot_account ]);
    console.log(pda.toString(), bet_usdt_account.toString(), moon_shot_account.publicKey.toString());
    console.log("Bust account txn signature: ", tx1);
    const tx = await program.rpc.initialize({
      accounts: {
        ownerAccount: divvyAccount.publicKey.toString(),
        betUsdcAccount: bet_usdt_account.toString(),
        moonShotAccount: moon_shot_account.publicKey.toString()
      }, signers: [divvyAccount]
    });
    console.log("Initialize txn signature: ", tx);
  });
});
