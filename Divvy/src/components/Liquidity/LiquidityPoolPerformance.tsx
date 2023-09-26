import React, { useState, Suspense } from 'react';
import { Col, Row } from "antd";
import { LiquidityPoolTabs } from './LiquidityPoolTabs';
import { CommonHeader } from "../Common/CommonHeader";
import { Pool } from '../../constants';

const LiquidityPoolGraph = React.lazy(()=>import('./LiquidityPoolGraph'))

export const LiquidityPoolPerformance = (props: { data : Array<Pool> | undefined }) => {
    const [poolPerformance, setPoolPerformance] = useState(1);
    return(
        <div style={{marginTop: 40, padding: 5}}>
            <Row>
                <Col span={24} md={10}>
                    <CommonHeader side={false} heading={"House Performance"} />
                </Col>
                <Col span={24} md={14}>
                    <div className="heading-align-container">
                        <div className="header-align">
                            <LiquidityPoolTabs poolPerformance={poolPerformance} setPoolPerformance={setPoolPerformance} />
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={24} md={24}>
                    <Suspense fallback={<div>loading ..</div>}>
                        <LiquidityPoolGraph data={props.data} poolPerformance={poolPerformance} />
                    </Suspense>                    
                </Col>
            </Row>
        </div>
    )
}