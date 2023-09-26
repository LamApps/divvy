import { Button, Dropdown, Menu } from "antd";
import { ButtonProps } from "antd/lib/button";
import React, { useContext } from "react";
import { LABELS } from "../../constants";
import { ETH_WALLET_PROVIDERS } from "../../constants/eth/walletproviders";
import { useMetaMask } from "../../contexts/eth/Metamask/UseMetaMask";
import { ETHWalletContext } from "../../contexts/eth/wallet";
export const EthConnectButton = () => {
    const { select } = useContext(ETHWalletContext)
    const { status, connect, account } = useMetaMask();
    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={select}>
                Change Wallets
            </Menu.Item>
        </Menu>
    );

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
        return (
            <Button disabled={true}>
                {keyToDisplay}
            </Button>
        );
    }

    return (
        <Dropdown.Button
            overlay={menu}
            style={{marginRight: '1em'}}
        >
            {LABELS.CONNECT_LABEL}
        </Dropdown.Button>
    );
};
