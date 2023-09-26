import { Col, Layout, Row, Table } from "antd";
import { useContext, useEffect, useState } from "react";
import { LeftSideBar } from "../components/LeftSideBar";
import { Loader } from "../components/Loader";
import { MobileHeader } from "../components/Nav/Mobile/MobileHeader";
import { NavBar } from "../components/Nav/NavBar";
import { RightSideBar } from "../components/RightSideBar";
import { BettingDashboardHeader } from "../components/BettingDashboard/BetingDashboardHeader";
import { BettingDashboardMiddle } from "../components/BettingDashboard/BettingDashboardMiddle";
import { BettingDashboardOverview } from "../components/BettingDashboard/BettingDashboardOverview";
import { LiquidityProviderDashboard } from "../components/LiquidityProvider/LiquidityProviderDashboard";
import { HeaderTypes } from "../constants/HeaderTypes";
import { BetsContext } from "../contexts/bets";
import { useWallet } from "../contexts/sol/wallet";
import { useGetBetsQuery } from "../store/getBets";
import { ConnectLink } from "../components/Nav/ConnectLink";
import { useMediaQuery } from "../utils/utils";

export const DashboardView = () => {
    const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [isBetSlipsVisible, setBetSlipsVisible] = useState(false);
    const [switchVal, setSwitchVal] = useState(0);
    let dataSource: any = [];
    const wallet = useWallet();
    const { data, error, isLoading } = useGetBetsQuery(wallet?.publicKey?.toString())
    const bets = useContext(BetsContext);
    let isMobile = useMediaQuery('(max-width: 400px)');
    if (!isLoading && !error && data) {
      data.map((item) => {
        dataSource.push({
          key: item.betId.toString(),
          betId: item.betId,
          sport: item.sportName,
          season: item.seasonName,
          risk: item.risk/10**6,
          odds: item.odds,
          payout: item.payout,
          selection: item.selection,
          betType: item.betType,
          // TO DO: use a function to get other types later
          status: item.status == 1 ? "Pending" : "Graded",
        })
      })
    }
    return (
        <Layout style={{ backgroundColor: "#0D0D0D" }}>
            <Row>
                <Col xs={24} sm={24} md={0}>
                    <MobileHeader headerType={HeaderTypes.Dashboard} isBetSlipsVisible={isBetSlipsVisible} setBetSlipsVisible={setBetSlipsVisible} isMobileMenuVisible={isMobileMenuVisible} setMobileMenuVisible={setMobileMenuVisible} />
                </Col>
                <Col span={4} xs={isMobileMenuVisible ? 24 : 0} sm={isMobileMenuVisible ? 24 : 0} md={4}>
                    <LeftSideBar>
                        <NavBar />
                    </LeftSideBar>
                </Col>
                {(!isMobile || !isMobileMenuVisible && !isBetSlipsVisible) &&
                    <Col span={24} xs={24} sm={24} md={20}>
                        <div style={{padding:'40px 4vw', height:'100vh', overflowY:'scroll'}}>
                            <ConnectLink />
                            <header className="root-content" style={isMobile ? {padding: 0} : {}}>
                                {isLoading ? <Loader /> : null}
                            </header>
                            <BettingDashboardMiddle  switchVal={switchVal} setSwitchVal={setSwitchVal} />
                            <BettingDashboardHeader data={data} error={error} />
                            { switchVal === 0 &&
                                <LiquidityProviderDashboard />
                            }
                            { switchVal === 1 &&
                                <BettingDashboardOverview  />
                            }      
                        </div>
                    </Col>
                }
                <Col span={24} xs={isBetSlipsVisible ? 24 : 0} sm={isBetSlipsVisible ? 24 : 0} md={24}>
                    <RightSideBar>
                        {/* <BetSlips /> */}
                    </RightSideBar>
                </Col>
            </Row>
        </Layout>
    )
}