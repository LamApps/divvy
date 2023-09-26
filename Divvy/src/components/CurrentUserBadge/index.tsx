import React, { useContext, useEffect, useState } from "react";
import { useWallet } from "../../contexts/sol/wallet";
import { shortenAddress } from "../../utils/utils";
import { usdcAmountReducedLength } from "../../constants";
import { UserUSDCContext } from "../../contexts/sol/userusdc";
import { Button, Popover } from "antd";
import { SolWalletSettings } from "../Settings/SolWalletSettings";
import { UserGameTokenContext } from "../../contexts/sol/usergametoken";

export const CurrentUserBadge = (props: {}) => {
  const [balanceMode, switchBalanceMode] = useState<'game' | 'sport'>('sport');
  const { userGameToken } = useContext(UserGameTokenContext)
  
  useEffect(() => {
    if (window.location.pathname.indexOf('/games/') == 0) {
      switchBalanceMode('game');
    } else {
      switchBalanceMode('sport');
    }
  }, [window.location.pathname]);
  
  const { wallet, provider } = useWallet();
  const { userUSDC } = useContext(UserUSDCContext)
  if (!wallet?.publicKey) {
    return null;
  }

  // should use SOL ◎ ? Nope :)

  return (
    <Popover
      placement="topRight"
      content={<SolWalletSettings />}
      trigger="click"
      color='black'
    >
      <Button style={{marginRight:'0.5rem'}}>
        <div className="wallet-wrapper">
          <span style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
            { balanceMode == 'sport' ? 
              `${usdcAmountReducedLength(userUSDC)} USDC`
              :
              `Balance: ${userGameToken.toFixed(2)}`
            }
          </span>
          <img src={provider?.icon} style={{width:'20px', height:'20px', marginLeft:'0.7rem', marginRight:'0.5rem'}} alt="" />
          {shortenAddress(`${wallet.publicKey}`)}
          {/* <Identicon
            address={wallet.publicKey.toBase58()}
            style={{ marginLeft: "0.5rem", display: "flex", alignSelf: 'right' }}
          /> */}
        </div>
      </Button>
    </Popover>
  )
};
