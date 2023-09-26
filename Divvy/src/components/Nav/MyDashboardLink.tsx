import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { DASHBOARD_VIEW_PATH, tokenAmountToString } from "../../constants";
import { HousePoolContext } from "../../contexts/sol/hpliquidity";
import { UserUSDCContext } from "../../contexts/sol/userusdc";
import { useMediaQuery } from "../../utils/utils";
import LinkLabel from "./LinkLabel";
export const MyDashboardLink = () => {
  const abort = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };
  const { userUSDC } = useContext(UserUSDCContext)
  let isMobile = useMediaQuery('(max-width: 400px)');
  return (
    <Link
      to={DASHBOARD_VIEW_PATH} style={ isMobile ? {width: '50%'} : {}}>
      <div className="sidebar-section text-secondary" style={isMobile ? {height: '100%'} : {}}>
        {/* Link to the real MyDashboard when it is complete */}
        <LinkLabel style={{ marginBottom: "0.83em" }}>
          <h2 style={{ marginBottom: 0 }}>My Dashboard</h2>
        </LinkLabel>
        <small>
          <div className="balance-container" style={ isMobile ? {flexWrap: 'wrap'} : {}}>
          <span style={ isMobile ? {width: '100%'} : {}}>Wallet balance</span>
          <span className="balance">
            {tokenAmountToString(userUSDC)} USDC
          </span>
          </div>
        </small>
      </div>
    </Link>
  );
};
