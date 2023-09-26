import { Button, Col, Row } from "antd";
import { useMediaQuery } from "../../utils/utils";
import { LiquidityAvailability } from "./LiquidityAvailability";
import { LiquidityAvailabilityBar } from "./LiquidityAvailabilityBar";
import { LiquidityDistribution } from "./LiquidityDistribution";
import { LiquidityPool } from "./LiquidityPool";
export const LiquidityGlobalStats = (props: any) => {
  let isMobile = useMediaQuery('(max-width: 400px)');
  return (
    <Row style={{ marginTop: 40, padding: 5 }}>
      <Col span={0} md={7}>
        <LiquidityAvailability />
      </Col>
      <Col style={{ textAlign: "center", overflow:'hidden' }} span={24} md={10}>
        <LiquidityAvailabilityBar />
        <LiquidityPool />
      </Col>
      <div className="horizontal-outline" />
      <Col span={12} md={0}>
        <LiquidityAvailability />
      </Col>
      <Col span={12} md={7}>
        <LiquidityDistribution />
      </Col>
      {isMobile && <Col span={24} md={24}>
        <Button style={{width:'100%', padding: '0.6em', height:'auto', display: 'flex', justifyContent: 'space-between'}} onClick={() => props.setBetSlipsVisible(true)}>
          <span>Deposit &amp; withdraw</span>
          <span>{'>'}</span>
        </Button>
      </Col>}
    </Row>
  );
};
