import { useState } from "react";
import { Col, Row } from "antd";
import { CommonHeader } from "../Common/CommonHeader";
import { BettingSwitch } from "./BettingSwitch";
import { TransactionData } from "../Common/TransactionData";
import { useMediaQuery } from "../../utils/utils";
export const BettingDashboardMiddle = (props: { switchVal: number, setSwitchVal: any }) => {
    let isMobile = useMediaQuery('(max-width: 400px)');
    return (
        <div style={{marginTop: 10, marginBottom: isMobile ? 30 : 0}}>
            <Row style={{justifyContent: 'flex-end'}}>
                <Col span={36} md={10} className="balance-container">
                    <BettingSwitch switchVal={props.switchVal} setSwitchVal={props.setSwitchVal}/>
                </Col>
                <Col span={36} md={16} className="balance-container">
                </Col>                
            </Row>
        </div>
    )
}