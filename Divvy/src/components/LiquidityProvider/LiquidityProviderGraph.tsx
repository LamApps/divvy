import React, { useState, Suspense } from 'react';
import { Col, Row, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { CommonHeader } from "../Common/CommonHeader";
import { Pool } from '../../constants';
import { useGetPoolQuery } from "../../store/getPool";
import { MS_IN_DAY, BETS_VIEW_PATH } from "../../constants";

const { Option } = Select;

const LiquidityPoolGraph = React.lazy(()=>import('../Liquidity/LiquidityPoolGraph'))
const currTime = (new Date()).getTime(); 

export const LiquidityProviderGraph = () => {
  const [poolPerformance, setPoolPerformance] = useState(1);
  const [interval, setInterval] = useState(MS_IN_DAY * 30);
  const { data } = useGetPoolQuery((currTime-interval).toString());

  const handleChange = (e : any) => {
    let interval = (e === "week" ? MS_IN_DAY * 7 : e === "month" ? MS_IN_DAY * 30 : MS_IN_DAY * 30 * 12);         
    setInterval(interval);
  }

  return(
    <div style={{marginTop: 40}}>
      <Row>
        <Col span={24} md={10}>
          <CommonHeader side={true} heading={"My house balance"} />
        </Col>
        <Col span={24} md={14}>
          <div className="heading-align-container dashboard-graph-handler">
            <div className="header-align">
              <span>Show data for: </span>
              <Select defaultValue="month" onSelect={handleChange} className="my-house-balance-select" suffixIcon={<DownOutlined style={{marginTop: 0, color: "#fff"}} className="direction-icon" />}>
                <Option value="week">Past week</Option>
                <Option value="month">Past month</Option>
                <Option value="year">Past year</Option>
              </Select>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24} md={24}>
          <Suspense fallback={<div>loading ..</div>}>
            <LiquidityPoolGraph data={data} poolPerformance={poolPerformance} />
          </Suspense>                    
        </Col>
      </Row>
    </div>
  )
}