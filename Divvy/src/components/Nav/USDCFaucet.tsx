import { useContext } from "react";
import { Link } from "react-router-dom";
import { FAUCET_VIEW_PATH } from "../../constants";
import { ENV } from "../../constants/sol/env";
import { useConnectionConfig } from "../../contexts/sol/connection";
import { ChainSelectContext } from "../../contexts/chainselect";
import LinkLabel from "./LinkLabel";
import { ChainType } from "../../constants/chains";
import { useWallet } from "../../contexts/sol/wallet";

export const USDCFaucetLink = () => {
    const chainSelect = useContext(ChainSelectContext);
    const connectionConfig = useConnectionConfig();
    const wallet = useWallet();
    const isDevnet = chainSelect.chain === ChainType.Sol && connectionConfig.env === ENV.Devnet;
    const isVisible = wallet.connected && isDevnet;
    return (
        isVisible?
            <Link
                to={FAUCET_VIEW_PATH}>
                <div className="sidebar-section text-secondary">
                    <LinkLabel style={{ marginBottom: "0.83em" }}>
                        <h2 style={{ marginBottom: 0 }}>Get Devnet USDC</h2>
                    </LinkLabel>
                    <small>
                        <div className="balance-container">
                        </div>
                    </small>
                </div>
            </Link>
            : isDevnet ? <div className="sidebar-section text-secondary">Connect wallet to get Devnet USDC</div>
            : <></>
    );
};
