import React from 'react';
import { Button, Row, Col } from "antd";
import { CommonHeader } from "../Common/CommonHeader";
import LinkLabel from "../Nav/LinkLabel";

export const LiquidityProviderDivvyTokens = () => {
  return (
    <div style={{marginTop: '3em'}}>
      <div style={{borderBottom:'1px solid rgba(255, 255, 255, 0.12)', marginBottom: '1em'}}>
        <CommonHeader side={true} heading={"Divvy tokens"}  />
      </div>
      <Row style={{display:'flex', alignItems:'center'}}>
        <Col span={24} md={7}>
          <div>
            <small>My Divvy tokens</small>
            <CommonHeader side={true} heading={"XX, XXX DVY"} />
          </div>
        </Col>
        <Col span={24} md={7}>
          <div>
            <small>Stake earnings:</small>
            <CommonHeader side={true} heading={"+XX, XXX DVY"} />
          </div>
        </Col>
        <Col span={24} md={10}>
          <Button style={{width:'100%', padding: '0.6em', height:'auto'}}>
            <LinkLabel style={{ margin:"auto" }}>
              <span>Claim stake earnings</span>
            </LinkLabel>
          </Button>
        </Col>
      </Row>
    </div>
  )
}