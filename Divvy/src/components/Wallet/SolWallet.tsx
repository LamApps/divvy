import React from "react";
import { Button, Popover } from "antd";
import { useWallet } from "../../contexts/sol/wallet";
import { CurrentUserBadge } from "../CurrentUserBadge";
import { SettingOutlined } from "@ant-design/icons";
import { SolSettings } from "../Settings/SolSettings";
import { LABELS } from "../../constants";
import { SolConnectButton } from "../ConnectButton/SolConnectButton";

export const SolWallet = (props: { left?: JSX.Element; right?: JSX.Element }) => {
  const { connected } = useWallet();

  const TopBar = (
    <div className="wallet">
      {connected ? (
        <CurrentUserBadge />
      ) : (
        <SolConnectButton
          type="text"
          allowWalletChange={true}
          style={{ marginRight: '1em' }}
        />
      )}
      <Popover
        placement="topRight"
        title={LABELS.SETTINGS_TOOLTIP}
        content={<SolSettings />}
        trigger="click"
        color='black'
      >
        <Button
          type="text"
          icon={<SettingOutlined />}
        />
      </Popover>
      {props.right}
    </div>
  );

  return TopBar;
};
