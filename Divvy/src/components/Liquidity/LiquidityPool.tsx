import { useContext } from "react";
import { tokenAmountToString } from "../../constants";
import { BetStateContext } from "../../contexts/sol/betstate";
import { BetPoolContext } from "../../contexts/sol/betusdt";
import { HousePoolContext } from "../../contexts/sol/hpliquidity";

export const LiquidityPool = () => {
  const { htBalance } = useContext(HousePoolContext);
  const { liveLiquidity, lockedLiquidity } = useContext(BetStateContext)
  const { bettorBalance } = useContext(BetPoolContext);

    return (
      <div className="liquidity-pool">
        <p className="text-primary">Total in Liquidity Pool</p>
        <h2><span style={{ fontSize: "2rem", fontWeight: 800 }}>{tokenAmountToString(htBalance + bettorBalance)}</span> USDC</h2>
      </div>
    );
};