import { useContext } from "react";
import { tokenAmountToString } from "../../../constants"
import { UserUSDCContext } from "../../../contexts/sol/userusdc";

export const WalletBalance = () => {
  const { userUSDC } = useContext(UserUSDCContext)
  return (
        <div style={{ marginTop: 9 }}>
            <div style={{ fontSize: 14 }}>
            {tokenAmountToString(userUSDC)} USDC
            </div>
            <div style={{ fontSize: 10 }}>
                Wallet Balance
            </div>
        </div>
    )
}