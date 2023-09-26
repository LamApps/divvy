import { Button, Modal } from "antd";
import React, {
    useCallback,
    useContext,
    useState,
} from "react";
import { notify } from "../../utils/notifications";
import { ETH_WALLET_PROVIDERS } from "../../constants/eth/walletproviders";
import { MetaMaskProvider } from "./Metamask/MetaMaskProvider";
import { useMetaMask } from "./Metamask/UseMetaMask";
export const ETHWalletContext = React.createContext<any>(null);

export function ETHWalletProvider({ children = null as any }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const select = useCallback(() => setIsModalVisible(true), []);
    const close = useCallback(() => setIsModalVisible(false), []);
    const { status, connect, account } = useMetaMask();
    return (
        <ETHWalletContext.Provider value={{
            select,
        }}>
            {children}
            <Modal
                title="Select Wallet"
                okText="Connect"
                visible={isModalVisible}
                okButtonProps={{ style: { display: "none" } }}
                onCancel={close}
                width={400}
            >
                {ETH_WALLET_PROVIDERS.map((provider) => {
                    const onClick = function () {
                        connect().then(() => {
                            if (account) {
                                const keyToDisplay =
                                    account.length > 20
                                        ? `${account.substring(
                                            0,
                                            7
                                        )}.....${account.substring(
                                            account.length - 7,
                                            account.length
                                        )}`
                                        : account;
                                notify({
                                    message: "Wallet update",
                                    description: "Connected to wallet " + keyToDisplay,
                                });
                            }
                        })
                    };
                    return (
                        <Button
                            size="large"
                            type={"primary"}
                            onClick={onClick}
                            icon={
                                <img
                                    alt={`${provider.name}`}
                                    width={20}
                                    height={20}
                                    src={provider.icon}
                                    style={{ marginRight: 8 }}
                                />
                            }
                            style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                marginBottom: 8,
                            }}
                        >
                            {provider.name}
                        </Button>
                    );
                })}
            </Modal>
        </ETHWalletContext.Provider>
    );
}