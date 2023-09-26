import { Connection, Keypair, PublicKey, Signer, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { AccountLayout, Token } from "@solana/spl-token";
import * as IDS from "../../../utils/ids";

/// Returns an instruction to create a token address for the mint.
/// Uses the associated token address by default, or creates a
// new address if that one is occupied.
/// If the user already has a token account this method will
/// create a duplicate at a different address.
export const createTokenAccount = async (connection: Connection, mint: PublicKey, owner: PublicKey)
  : Promise<[tokenSigner: Signer, ix: TransactionInstruction[]]> => {
  let tokenSigner: Signer = Keypair.generate();

  const createTokenAccountIx = SystemProgram.createAccount({
    fromPubkey: owner,
    newAccountPubkey: tokenSigner.publicKey,
    lamports: await Token.getMinBalanceRentForExemptAccount(connection),
    space: AccountLayout.span,
    programId: IDS.TOKEN_PROGRAM_ID,
  })

  const initTokenAccountIx = Token.createInitAccountInstruction(
    IDS.TOKEN_PROGRAM_ID,
    mint,
    tokenSigner.publicKey,
    owner,
  );

  return [tokenSigner, [createTokenAccountIx, initTokenAccountIx]];
}