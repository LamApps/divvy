import React, { useState, useEffect, Suspense } from 'react';
import { Col, Row, Divider } from "antd";
import { CommonHeader } from "../Common/CommonHeader";
import { LiquidityProviderData } from "./LiquidityProviderData";
import { LiquidityProviderDeposit } from './LiquidityProviderDeposit';
import { LiquidityProviderWithdrawal } from './LiquidityProviderWithdrawal';
import { useGetCommencedMarketsQuery } from "../../store/getCommencedMarkets";
import { LiquidityProviderGraph } from './LiquidityProviderGraph';
import { LiquidityProviderDivvyTokens } from './LiquidityProviderDivvyTokens';

export const LiquidityProviderDashboard = () => {
    const { data, error, isLoading } = useGetCommencedMarketsQuery(null);
    const [sortBy, setSortBy] = useState("placed");
    const [sortedInfo, setSortedInfo] = useState({ columnKey: null, order: null });
    const [filteredInfo, setFilteredInfo] = useState({ sport: null });
    const [width, setWindowWidth] = useState(0);

    const updateDimensions = () => {
        const width = window.innerWidth
        setWindowWidth(width / 2.5)
    }
    useEffect(() => {
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => {
        window.removeEventListener("resize", updateDimensions);
        };
    }, [])
    return (
        <div style={{marginTop: 50}}>
            <Row style={{display: 'flex', alignItems: 'center'}}>
                <Col span={0} md={10}>
                    <video 
                        autoPlay={true} 
                        loop={true} width={width > 160 ? width / 3 : width / 1.5} height={width > 160 ? width / 3 : width / 1.5} 
                        src={"https://storage.googleapis.com/divvy-cdn/assets/animated_logo.mp4"} />
                </Col>
                <Col span={36} md={14} style={{textAlign:"right", display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
                    <CommonHeader side={true} heading={"House Liquidity Provider Dashboard"} />
                    <Divider />
                    <Row style={{width: '100%'}}>
                        <Col span={0} md={4}></Col>
                        <Col span={10} md={10}>
                            <LiquidityProviderData textContext={"House balance"} percentage={'0.173% owned'} data={"9,739.73 USDC"} />
                        </Col>
                        <Col span={4} md={0}></Col>
                        <Col span={10} md={10}>
                            <LiquidityProviderData textContext={"Divvy rewards balance"} percentage='' data={"9,739.73 DVY"} />
                        </Col>
                    </Row>
                    <Divider />
                    <Row style={{width: '100%'}}>
                        <Col span={0} md={4}></Col>
                        <Col span={10} md={10}>
                            <LiquidityProviderData textContext={"House APY"} percentage={''} data={"56%"} />
                        </Col>
                        <Col span={4} md={0}></Col>
                        <Col span={10} md={10}>
                            <LiquidityProviderData textContext={"Rewards APY"} percentage='' data={"43%"} />
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row style={{marginTop: 50, justifyContent:'space-between'}} >
              <Col span={24} md={11}>
                <LiquidityProviderDeposit  isLoading={isLoading} data={data} />
              </Col>
              <Col span={24} md={11}>
                <LiquidityProviderWithdrawal  isLoading={isLoading} data={data} />
              </Col>
            </Row>
            <LiquidityProviderDivvyTokens />
            <LiquidityProviderGraph />
        </div>
    );
};