import { Col, Layout, Row } from "antd";
import { useState } from "react";
import { LeftSideBar } from "../../components/LeftSideBar";
import { MobileHeader } from "../../components/Nav/Mobile/MobileHeader";
import { NavBar } from "../../components/Nav/NavBar";
import { HeaderTypes } from "../../constants/HeaderTypes";
import { useWallet } from "../../contexts/sol/wallet";
import { ConnectLink } from "../../components/Nav/ConnectLink";
import { Card } from 'antd';
import { Link } from "react-router-dom";
import { GAMES_VIEW_PATH, MOONSHOT_VIEW_PATH } from "../../constants";

const { Meta } = Card;

export const GamesView = () => {
    const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [isBetSlipsVisible, setBetSlipsVisible] = useState(false);
    const { connected } = useWallet();

    return (
        <Layout style={{ backgroundColor: "#0D0D0D" }}>
            <Row>
                <Col xs={24} sm={24} md={0}>
                    <MobileHeader headerType={HeaderTypes.Bets} isBetSlipsVisible={isBetSlipsVisible} setBetSlipsVisible={setBetSlipsVisible} isMobileMenuVisible={isMobileMenuVisible} setMobileMenuVisible={setMobileMenuVisible} />
                </Col>
                <Col span={5} xs={isMobileMenuVisible ? 24 : 0} sm={isMobileMenuVisible ? 24 : 0} md={5}>
                    <LeftSideBar>
                        <NavBar />
                    </LeftSideBar>
                </Col>
                {!isMobileMenuVisible && !isBetSlipsVisible &&
                    <Col span={24} xs={24} sm={24} md={19}>
                        <header className="root-content">
                            <ConnectLink />
                            <br />
                            <br />
                            <h1>Divvy Games</h1>
                            <Link to={GAMES_VIEW_PATH+MOONSHOT_VIEW_PATH}>
                                <Card
                                    style={{ width: 300 }}
                                    hoverable
                                    cover={
                                    <img
                                        alt="example"
                                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                    />
                                    }>
                                    <Meta title="Moon Shot" description="Check your luck" />
                                </Card>
                            </Link>
                        </header>
                        <Layout>
                        </Layout>
                    </Col>
                }
            </Row>
        </Layout>
    )
}