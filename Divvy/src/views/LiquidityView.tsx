import { LeftSideBar } from "../components/LeftSideBar";
import { RightSideBar } from "../components/RightSideBar";
import { NavBar } from "../components/Nav/NavBar";
import { MyLiquidity } from "../components/MyLiquidity/MyLiquidity";
import { LiquidityGlobalStats } from "../components/Liquidity/LiquidityGlobalStats";
import { LiquidityGlance } from "../components/Liquidity/LiquidityGlance";
import { LiquidityPoolPerformance } from "../components/Liquidity/LiquidityPoolPerformance";
import { LiquidityPoolActivity } from "../components/Liquidity/LiquidityPoolActivity";
import { GoBack } from "../components/Common/GoBack";
import { Col, Layout, Row } from "antd";
import { MobileHeader } from "../components/Nav/Mobile/MobileHeader";
import { useState } from "react";
import { HeaderTypes } from "../constants/HeaderTypes"
import { useGetPoolQuery } from "../store/getPool";
import { MS_IN_DAY, BETS_VIEW_PATH } from "../constants";
import { useGetTransactionsQuery } from "../store/getTransactions";
import { ConnectLink } from "../components/Nav/ConnectLink";
import { useMediaQuery } from "../utils/utils";

const currTime = (new Date()).getTime(); 
const LiquidityView = () => {
  const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isBetSlipsVisible, setBetSlipsVisible] = useState(false);
  const [interval, setInterval] = useState(MS_IN_DAY * 7);
  const { data, error, isLoading } = useGetPoolQuery((currTime-interval).toString());
  const { data: transData, error: transError, isLoading: transIsLoading } = useGetTransactionsQuery(null);
  let isMobile = useMediaQuery('(max-width: 400px)');
  return (
    <Layout style={{ backgroundColor: "#0D0D0D" }}>
      <Row>
        <Col xs={24} sm={24} md={0}>
          <MobileHeader headerType={HeaderTypes.Liquidity} isBetSlipsVisible={isBetSlipsVisible} setBetSlipsVisible={setBetSlipsVisible} isMobileMenuVisible={isMobileMenuVisible} setMobileMenuVisible={setMobileMenuVisible} />
        </Col>
        <Col span={4} xs={isMobileMenuVisible ? 24 : 0} sm={isMobileMenuVisible ? 24 : 0} md={4}>
          <LeftSideBar>
            <NavBar />
          </LeftSideBar>
        </Col>
        {(!isMobile || !isMobileMenuVisible && !isBetSlipsVisible) &&
          <Col span={24} md={16}>
            <header className="root-content">
              <div>
                <Row  style={{display:'flex', justifyContent:'space-between'}}>
                  <Col span={24} md={10}><GoBack path={`${BETS_VIEW_PATH}`} label="Back to Betting"/></Col>
                  <Col span={0} md={10}><ConnectLink /></Col>
                </Row>
              </div>
              <LiquidityGlobalStats setBetSlipsVisible={setBetSlipsVisible} />
              <LiquidityGlance data={data} setInterval={setInterval} transactions={transData} />
              <LiquidityPoolPerformance data={data} />
              <LiquidityPoolActivity transactions={transData} />
            </header>
          </Col>
        }
        <Col span={4} xs={isBetSlipsVisible ? 24 : 0} sm={isBetSlipsVisible ? 24 : 0} md={4}>
          <RightSideBar>
            <MyLiquidity />
          </RightSideBar>
        </Col>
      </Row>
    </Layout>
  );
};
export default LiquidityView
