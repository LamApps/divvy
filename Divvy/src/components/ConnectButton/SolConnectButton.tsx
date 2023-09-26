import { Button, Dropdown, Menu } from "antd";
import { ButtonProps } from "antd/lib/button";
import React from "react";
import { LABELS } from "../../constants";
import { useWallet } from "../../contexts/sol/wallet";

export interface ConnectButtonProps
  extends ButtonProps,
    React.RefAttributes<HTMLElement> {
  allowWalletChange?: boolean;
}

export const SolConnectButton = (props: ConnectButtonProps) => {
  const { connected, connect, select, provider } = useWallet();
  const { onClick, children, disabled, allowWalletChange, ...rest } = props;

  // only show if wallet selected or user connected
  if (!provider || !allowWalletChange) {
    return (
      <Button
        {...rest}
        onClick={connected ? onClick : connect}
        disabled={connected && disabled}
      >
        {connected ? props.children : LABELS.CONNECT_LABEL}
      </Button>
    );
  }

  return (
    <Button
      onClick={connected ? onClick : select}
      disabled={connected && disabled}
      style={{marginRight: '1em'}}
    >
      {LABELS.CONNECT_LABEL}
    </Button>
  );
};
