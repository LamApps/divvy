import { LedgerWalletAdapter } from "../../wallet-adapters/sol/ledger";
import { SolongWalletAdapter } from "../../wallet-adapters/sol/solong";
import { PhantomWalletAdapter } from "../../wallet-adapters/sol/phantom";
const ASSETS_URL =
    "https://raw.githubusercontent.com/solana-labs/oyster/main/assets/wallets/";
export const WALLET_PROVIDERS = [
    {
        name: "Phantom",
        url: "https://phantom.app/",
        icon: `https://raydium.io/_nuxt/img/phantom.d9e3c61.png`,
        adapter: PhantomWalletAdapter,
    },
    {
        name: "Sollet",
        url: "https://www.sollet.io",
        icon: `${ASSETS_URL}sollet.svg`,
    },
    {
        name: "Solong",
        url: "https://solongwallet.com",
        icon: `${ASSETS_URL}solong.png`,
        adapter: SolongWalletAdapter,
    },
    {
        name: "Solflare",
        url: "https://solflare.com/access-wallet",
        icon: `${ASSETS_URL}solflare.svg`,
    },
    {
        name: "MathWallet",
        url: "https://mathwallet.org",
        icon: `${ASSETS_URL}mathwallet.svg`,
    },
    {
        name: "Ledger",
        url: "https://www.ledger.com",
        icon: `${ASSETS_URL}ledger.svg`,
        adapter: LedgerWalletAdapter,
    },
];
