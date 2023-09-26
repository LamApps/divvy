import React from "react";
import { Button, Popover } from "antd";
import { useWallet } from "../../contexts/sol/wallet";
import { CurrentUserBadge } from "../CurrentUserBadge";
import { SettingOutlined } from "@ant-design/icons";
import { LABELS } from "../../constants";
import { EthConnectButton } from "../ConnectButton/EthConnectButton";
import { EthSettings } from "../Settings/EthSettings";

export const EthWallet = (props: { left?: JSX.Element; right?: JSX.Element }) => {

    const TopBar = (
        <div className="wallet">           
            <EthConnectButton />
            <Popover
                placement="topRight"
                title={LABELS.SETTINGS_TOOLTIP}
                content={<EthSettings />}
                trigger="click"
            >
                <Button
                    shape="circle"
                    type="text"
                    icon={<SettingOutlined />}
                />
            </Popover>
            {props.right}
        </div>
    );

    return TopBar;
};
