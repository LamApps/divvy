import { DepositLiquidity } from "./DepositLiquidity";
import { WithdrawLiquidity } from "./WithdrawLiquidity";
import { DivvyDao } from "./DivvyDao";
import { StakeHT } from "./StakeHT";
import { useContext } from "react";
import { UserHTContext } from "../../contexts/sol/userht";
import { Tooltip } from "antd";
import { LABELS } from "../../constants/labels"
import { InfoCircleOutlined } from "@ant-design/icons"
import { useGetCommencedMarketsQuery } from "../../store/getCommencedMarkets";
import { tokenAmountToString } from "../../constants";
import { HPTokenContext } from "../../contexts/sol/hptoken";
import { HousePoolContext } from "../../contexts/sol/hpliquidity";
import { BetStateContext } from "../../contexts/sol/betstate";
export const MyLiquidity = (props: {}) => {
  const { data, error, isLoading } = useGetCommencedMarketsQuery(null);
  const { userHT } = useContext(UserHTContext);
  const { htBalance } = useContext(HousePoolContext);
  const { htSupply } = useContext(HPTokenContext);
  const { lockedLiquidity } = useContext(BetStateContext)
  return (
    <div>
      <div className="sidebar-section">
        <h3>My House Pool Stats</h3>
        <small>
          <div className="balance-container">
            <span>House Pool tokens</span>
            <span className="balance">
              {tokenAmountToString(userHT)} HT
            </span>
          </div>
          <div className="balance-container">
            <span>Balance in USDC</span>
            <span className="balance">{tokenAmountToString(userHT / (htSupply / (htBalance + lockedLiquidity)))} USDC</span>
          </div>
          <div className="balance-container">
            <Tooltip title={LABELS.CONVERSION_RATIO}>
              <span style={{ display: 'flex' }}>Conversion Ratio <InfoCircleOutlined style={{ fontSize: 9, marginTop:3.4, marginLeft:2 }} /></span>
            </Tooltip>
            <span className="balance">{(htBalance + lockedLiquidity) / htSupply}</span>
          </div>
        </small>
      </div>
      <DepositLiquidity  isLoading={isLoading} data={data} />
      <WithdrawLiquidity isLoading={isLoading} data={data} />
      {/* 
        <DivvyDao />
        <StakeHT />
      */}
    </div>
  );
};
