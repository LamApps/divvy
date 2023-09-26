import { useContext } from "react";
import { Col, Row } from "antd";
import { CommonHeader } from "../Common/CommonHeader";
import { useWallet } from "../../contexts/sol/wallet";
import { UserUSDCContext } from "../../contexts/sol/userusdc";
import { LAMPORTS_PER_USDC } from "../../constants/math";
import { ChainSelectContext } from "../../contexts/chainselect";
import { tokenAmountToString } from "../../constants";
export const BettingDashboardHeader = (props: { data: any , error: any}) => {
  const wallet = useWallet();
  const { chain } = useContext(ChainSelectContext)
  const { userUSDC } = useContext(UserUSDCContext)
  return (
    <div>
      <Row>
        <Col span={36} md={24}>
            <CommonHeader side={true} heading={"My Profile"} />
            <div className="horizontal-outline" />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
            <div className="liquidity-content">
                <span className="text-primary">Wallet Balance:</span>
                <h3 className="text-heavy">{tokenAmountToString(userUSDC)} USDC</h3>
            </div>
        </Col>
        <Col md={14}>
            <div className="liquidity-content" style={{overflowX: 'hidden'}}>
                <span className="text-primary">Wallet ID:</span>
                <h3 className="text-heavy">{wallet?.publicKey?.toString()}</h3>
            </div>
        </Col>        
      </Row>
    </div>
  );
};