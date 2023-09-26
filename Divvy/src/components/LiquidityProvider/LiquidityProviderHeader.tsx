import { useState, useEffect } from 'react';
import { Col, Row } from "antd";
import { CommonHeader } from "../Common/CommonHeader";
import { TransactionData } from "../Common/TransactionData";
export const LiquidtiyProviderHeader = () => {
    const [sortBy, setSortBy] = useState("placed");
    const [sortedInfo, setSortedInfo] = useState({ columnKey: null, order: null });
    const [filteredInfo, setFilteredInfo] = useState({ sport: null });
    return (
        <div style={{marginTop: 50}}>
            <Row >
                <Col span={36} md={14}>
                    <CommonHeader side={true} heading={"Betting Activity Dashboard"} />
                </Col>
                <Col span={36} md={10} style={{textAlign: "right"}}>
                    <TransactionData textContext={"All time betting P&L"} percentage={114} data={"9,739.73 USDC"} />
                </Col>
            </Row>
            <Row style={{marginTop: 50}}>
                <Col span={36} md={5}>
                    <CommonHeader side={true} heading={"Bets overview"} />
                </Col>
                <Col span={36} md={8}>
                </Col>
                <Col span={36} md={11}>
                </Col>
            </Row>
            <Row>
                <Col span={36} md={24}>
                </Col>
            </Row>
        </div>
    );
};