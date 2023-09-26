import { useContext } from "react"
import { ChainType } from "../constants/chains";
import { ChainSelectContext } from "./chainselect"
import { SolanaProvider } from "./sol";
import { AccountsProvider } from "./sol/accounts";
import { ConnectionProvider } from "./sol/connection";
import { WalletProvider } from "./sol/wallet";
import { ETHWalletProvider } from "./eth/wallet";
import { MetaMaskProvider } from "./eth/Metamask/MetaMaskProvider";
const RootContextProvider = (props: { children: any }) => {
    const { chain } = useContext(ChainSelectContext);
    if (chain === ChainType.Sol) {
        return (
            <ConnectionProvider>
                <WalletProvider>
                    <AccountsProvider>
                        <SolanaProvider>
                            {props.children}
                        </SolanaProvider>
                    </AccountsProvider>
                </WalletProvider>
            </ConnectionProvider>
        )
    }
    else {
        return (
            <ConnectionProvider>
                <MetaMaskProvider>
                    <ETHWalletProvider>
                        <AccountsProvider>
                            <SolanaProvider>
                                {props.children}
                            </SolanaProvider>
                        </AccountsProvider>
                    </ETHWalletProvider>
                </MetaMaskProvider>
            </ConnectionProvider>
        )
    }
}
export default RootContextProvider