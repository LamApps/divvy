import { Link } from "react-router-dom";
import { useContext } from "react";
import { HousePoolContext } from "../../contexts/sol/hpliquidity";
import LinkLabel from "../Nav/LinkLabel";
import { LIQUIDITY_VIEW_PATH, tokenAmountToString } from "../../constants";
import { BetStateContext } from "../../contexts/sol/betstate";
import { useMediaQuery } from "../../utils/utils";

export const LiquidityViewLink = () => {
  const { htBalance } = useContext(HousePoolContext);
  const { liveLiquidity, lockedLiquidity } = useContext(BetStateContext)
  let isMobile = useMediaQuery('(max-width: 400px)');
  return (
    <Link to={LIQUIDITY_VIEW_PATH} style={ isMobile ? {width: '50%'} : {}}>
      <div className="sidebar-section text-secondary" style={isMobile ? {height: '100%'} : {}}>
        <LinkLabel style={{marginBottom: "0.83em"}}>
          <h2 style={{marginBottom: 0}}>Liquidity Pool</h2>
        </LinkLabel>
        <small>
          { !isMobile ?
            <>
            <div className="balance-container">
              <span>Liquidity Pool balance</span>
              <span className="balance">
                {tokenAmountToString(htBalance)} USDC
              </span>
            </div>
            <div className="balance-container">
              <span style={ isMobile ? {width: '100%'} : {}}>Locked liquidity</span>
              <span className="balance">{tokenAmountToString(liveLiquidity + lockedLiquidity)} USDC</span>
            </div>
            </> : <></>
          }
          <div className="balance-container" style={ isMobile ? {flexWrap: 'wrap'} : {}}>
            <span>Available liquidity</span>
            <span className="balance">{tokenAmountToString(htBalance)} USDC</span>
          </div>
        </small>
      </div>
    </Link>
  );
};
