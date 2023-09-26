import { useContext, useState } from "react";
import { Bet } from "../constants";
import { RightSideBar } from "../components/RightSideBar";
import { LeftSideBar } from "../components/LeftSideBar";
import { NavBar } from "../components/Nav/NavBar";
import { BetSlips } from "../components/Home/BetSlips";
import { MobileHeader } from "../components/Nav/Mobile/MobileHeader"
import { Layout, Row, Col } from "antd";
import { HeaderTypes } from "../constants/HeaderTypes";
import SportProvider from "../contexts/sport";
import { SeasonsView } from "../components/Home/SeasonsView";
import { useWallet } from "../contexts/sol/wallet";
import { useGetBetsQuery } from "../store/getBets";
import { BetsContext } from "../contexts/bets";
import { ConnectLink } from "../components/Nav/ConnectLink";
import { useMediaQuery } from "../utils/utils";
import { GoBack } from "../components/Common/GoBack";

const BetsView = () => {
  const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isBetSlipsVisible, setBetSlipsVisible] = useState(false);
  const wallet = useWallet();
  const { data, error, isLoading } = useGetBetsQuery(wallet?.publicKey?.toString())
  const bets = useContext(BetsContext)
  let isMobile = useMediaQuery('(max-width: 400px)');

  if (!isLoading && !error && !bets?.bets.length && data?.length) {
    let bet: Array<Bet> = [];
    var b: Bet;
    data?.map((value: Bet) => {
      b = value
      switch (b.status) {
        case 1:
          bet.push(b);
      }
    })
    if(bet.length){
      bets?.addBets(bet);
    }
  }
  else {
    console.log(isLoading, error)
  }
  // }, [])
  return (
    <SportProvider>
      <Layout style={{ backgroundColor: "#0D0D0D" }}>
        <Row>
          <Col xs={24} sm={24} md={0}>
            <MobileHeader headerType={HeaderTypes.Bets} isBetSlipsVisible={isBetSlipsVisible} setBetSlipsVisible={setBetSlipsVisible} isMobileMenuVisible={isMobileMenuVisible} setMobileMenuVisible={setMobileMenuVisible} />
          </Col>
          <Col span={4} xs={isMobileMenuVisible ? 24 : 0} sm={isMobileMenuVisible ? 24 : 0} md={4}>
            <LeftSideBar>
              <NavBar />
            </LeftSideBar>
          </Col>
          {(!isMobile || !isMobileMenuVisible && !isBetSlipsVisible) &&
            <Col span={16} xs={24} sm={24} md={16}>
               
              <header className="root-content">
                <ConnectLink />
                <SeasonsView />
              </header>
            </Col>
          }
          <Col span={4} xs={isBetSlipsVisible ? 24 : 0} sm={isBetSlipsVisible ? 24 : 0} md={4}>
            <RightSideBar>
              <BetSlips />
            </RightSideBar>
          </Col>
        </Row>
      </Layout>
    </SportProvider>
  );
};
export default BetsView