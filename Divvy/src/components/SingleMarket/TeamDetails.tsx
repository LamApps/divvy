import { Row, Col } from 'antd'
import { useMediaQuery } from '../../utils/utils';
export const TeamDetails = (props: { name: string, logo: string }) => {
  let isMobile = useMediaQuery('(max-width: 400px)');
  return (
    <div >
      <Row style={{display:'flex', alignItems:'center'}}>
        <Col span={0} md={8}>
          <div className="team-logo">
              {/* <img src={props.logo} /> */}
              <div style={{backgroundImage: `url(${props.logo})`}}></div>
          </div>
        </Col>
        <Col span={24} md={16}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: isMobile ? 'center' : 'left' }}>
            <b style={{ fontSize: "1em", lineHeight: 'normal' }}>{props.name}</b>
          </div>
        </Col>
      </Row>
    </div>
  );
};
