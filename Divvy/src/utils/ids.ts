import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID as TOKEN_PROGRAM_ID_IMPORT, ASSOCIATED_TOKEN_PROGRAM_ID as ASSOCIATED_TOKEN_PROGRAM_ID_IMPORT } from "@solana/spl-token";
import { ENV } from "../constants/sol/env";

export const WRAPPED_SOL_MINT = new PublicKey("So11111111111111111111111111111111111111112");
export const TOKEN_PROGRAM_ID = TOKEN_PROGRAM_ID_IMPORT;
export const ASSOCIATED_TOKEN_PROGRAM_ID = ASSOCIATED_TOKEN_PROGRAM_ID_IMPORT;
export const LENDING_PROGRAM_ID = new PublicKey("TokenLending1111111111111111111111111111111");
export const SWAP_PROGRAM_ID = new PublicKey("SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8");

export const PROGRAM_IDS = [
  {
    name: "mainnet-beta",
  },
  {
    name: "testnet",
  },
  {
    name: "devnet",
  },
  {
    name: "localnet",
  },
];


// Bet Pool PubKeys
export const BET_POOL_PROGRAM_ID = new PublicKey("GWYmzg8M2QBH1ShezcQuFNhtxHhssSMCRrNviLs6wQyL");
export const BET_POOL_STATE_ACCOUNT = new PublicKey("3VtnEdVn779vkmksPhEiYedze4TGWSEwbgcMkZp1ax7q");
export const BET_POOL_PDA_ACCOUNT = new PublicKey("3Xsg8pok9jw44kGHwXfDy7aAikazR81dBAccgDGtpziQ");
export const BET_POOL_USDC_ACCOUNT = new PublicKey("Fj9Q9y5NY84NWU11m4AgR17ybSYsZoiPMa2HEWS7oWMi");

// House Pool PubKeys
export const HOUSE_POOL_PROGRAM_ID = new PublicKey("AGetrKU8hVdHEEzisekqPuer1ALHLG2jp5RkgTWKs2hC");
export const HOUSE_POOL_STATE_ACCOUNT = new PublicKey("G5ydWpxvCykgKxZ5z7CV1kCaAWaD992KyEG6N2tizdRs");
export const HOUSE_POOL_PDA_ACCOUNT = new PublicKey("5tqXcnJgyJY5axjL7BjPeT1GAibqH3aicUi86wf9zmFC");
export const HOUSE_POOL_USDC_ACCOUNT = new PublicKey("7rTAEWsdKFQP58oVu3YbbF38JV6P8daA4FnWhF3dFRBc");

// Game Keys
export const BUST_ACCOUNT = new PublicKey("GkCzD8kfGhPn3L4hXQpwuTjpqbGRQcSKsuqdjTHnHBzT");

//Other Pubkeys
export const HT_MINT = new PublicKey("AJDAS949LedZFV5jEaoaQQRnziaYTYnSsEhCsfnfsxeJ");
export const USDC_MINT_MAINNET = new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB");
export const USDC_MINT_DEVNET = new PublicKey("7cnY6yuFXzTLEsnXn4FkgvmXq4FyuUakQDQqHJkbQvYG");
export const FAUCET_PROGRAM_ID = new PublicKey("4Y4PC5NEPE7Go6tUeEuk64PnVS9t2NXccgFS2nafy3U8");

export const getUsdtMint = (env: ENV) => {
  if (env === ENV.Mainnet) {
    return USDC_MINT_MAINNET;
  }
  return USDC_MINT_DEVNET;
}

export const setProgramIds = (envName: string) => {
  let instance = PROGRAM_IDS.find((env) => env.name === envName);
  if (!instance) {
    return;
  }
};

export const programIds = () => {
  return {
    token: TOKEN_PROGRAM_ID,
  };
};
