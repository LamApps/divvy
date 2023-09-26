import { Col, Row } from "antd";
import { LiquidityActivityTable } from "./LiquidityActivityTable";
import { CommonHeader } from "../Common/CommonHeader";
import { Transactions } from "../../constants";

export const LiquidityPoolActivity = (props: { transactions : Array<Transactions> | null | undefined }) => {
  return (
    <div style={{marginTop: 40, padding: 5}}>
      <Row>
        <Col span={24}>
          <CommonHeader side={false} heading={"Divvy Activity Stream"} />
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{overflow:'hidden'}}>
          <LiquidityActivityTable transactions={props.transactions} />
        </Col>
      </Row>
    </div>      
  );
};