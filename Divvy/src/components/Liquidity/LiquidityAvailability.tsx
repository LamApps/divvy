
import { useContext } from "react";
import { tokenAmountToString } from "../../constants";
import { HousePoolContext } from "../../contexts/sol/hpliquidity";
import { BetStateContext } from "../../contexts/sol/betstate";
import { BetPoolContext } from "../../contexts/sol/betusdt";

export const LiquidityAvailability = () => {
  const { htBalance, accountData } = useContext(HousePoolContext);
  const { liveLiquidity, lockedLiquidity, pendingBets } = useContext(BetStateContext)
  const { bettorBalance } = useContext(BetPoolContext);
  return (
    <div className="liquidity-left">
      <div className="header-align">
        <div className="horizontal-outline" />
        <div className="liquidity-content">
          {/* <h6 className="text-secondary">Available Liquidity</h6> */}
          <h3><span className="liquidity-heavy">{tokenAmountToString(((htBalance - lockedLiquidity) * 100) / (htBalance + bettorBalance/* + lockedLiquidity liveLiquidity*/), 0, 2)}%</span> free</h3>
          <p className="text-primary">{tokenAmountToString(htBalance - lockedLiquidity)} USDC</p>
        </div>
        <div className="horizontal-outline" />
        <div className="liquidity-content">
          <h6 className="text-secondary">Better's risk</h6>
          <h3><span className="liquidity-heavy">{tokenAmountToString(((bettorBalance) * 100) / (htBalance + bettorBalance/* + lockedLiquidity liveLiquidity*/), 0, 2)}%</span></h3>
          <p className="text-primary">{tokenAmountToString(bettorBalance)} USDC</p>
        </div>
        <div className="horizontal-outline" />
      </div>
    </div>
  );
};
