// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

const anchor = require("@project-serum/anchor");
const { divvyAccount } = require("./constants");
const { createBustAccount } = require("./createBustAccount");

module.exports = async function (provider) {
  // Configure client to use the provider.
  anchor.setProvider(provider);

  // Add your deploy script here.
  it('Is initialized!', async () => {
    const program = anchor.workspace.divvy;
    let [moon_shot_account, ix] = await createBustAccount(connection);
    let bet_usdt_account = await createTokenAccount(payerAccount, USDT_MINT, pda.toString(), connection)
    let tx1 = await program.rpc.ix();
    console.log("Bust account txn signature: ", tx1);
    // const tx = await program.rpc.initialize({
    //   accounts: {
    //     ownerAccount: divvyAccount.publicKey.toString(),
    //     betUsdt_account: bet_usdt_account.publicKey.toString(),
    //     moonShotAccount: moon_shot_account.publicKey.toString()
    //   }
    // });
    console.log("Initialize txn signature: ", tx);
  });
}
