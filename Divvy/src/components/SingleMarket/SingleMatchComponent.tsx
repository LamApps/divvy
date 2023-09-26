import { useContext, useState } from "react"
import { Col, Row } from 'antd'
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { TeamDetails } from "./TeamDetails"
import { OddsType } from './OddsType';
import { OddsSelection } from './OddsSelection';
import { americanToDecimal, Market, MarketSide } from '../../constants';
import { getDate, getShortTimezone, getTime } from '../../utils/date';
import { codes } from "../../constants/processed"
import { SportContext } from "../../contexts/sport";
import { useMediaQuery } from "../../utils/utils";

export const SingleMatchComponent = (props: { market: Market }) => {
    const { sport, changeSport } = useContext(SportContext)
    const [oddsType, setoddsType] = useState("decimal")
    let isMobile = useMediaQuery('(max-width: 400px)');
    return (
      <div className="single-match">
        {/* <OddsType /> */}
        <Row>
          <Col span={24} md={0}>
            <div className="bet-time-container text-secondary">
              {getDate(props.market.commenceTime) + ' ' + getTime(props.market.commenceTime)} {getShortTimezone(props.market.commenceTime)}
            </div>
          </Col>
          <Col span={24} md={20}>
            <Row style={{alignItems:'center'}}>
              <Col span={7}></Col>
              {!isMobile && <Col span={2}></Col>}
              <Col span={isMobile ? 17 : 9}>
                <Row style={{display:'flex', alignItems:'center', margin: '1px 0 -4px'}}>
                  <Col span={8}>
                    <div className={"odds"} style={{margin: 0, padding: 0, background: 'transparent'}}>
                      <label>Moneyline</label>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className={"odds"} style={{margin: 0, padding: 0, background: 'transparent'}}>
                      <label>Spread</label>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className={"odds"} style={{margin: 0, padding: 0, background: 'transparent'}}>
                      <label>Total</label>
                    </div>
                  </Col>
                </Row>
              </Col>
              {!isMobile && <Col span={6}></Col>}
            </Row>
            <Row style={{alignItems:'center'}}>
              <Col span={7}>
                <TeamDetails name={props.market.teamB} logo={"https://storage.googleapis.com/divvy-cdn/MLB/" + props.market.teamB.toLowerCase().replaceAll(" ", "-").replaceAll("-fc", "")  + ".svg"} />
              </Col>
              {!isMobile && <Col span={2}></Col>}
              <Col span={isMobile ? 17 : 9}>
                <OddsSelection marketSide={MarketSide.teamB} market={props.market} selectionTeam={props.market.teamB} otherTeam={props.market.teamA} selection={"teamB"} odds={{
                  moneyline: americanToDecimal(props.market.teamBOddsMoneyline),
                  spread: americanToDecimal(props.market.teamBOddsSpread),
                  spreadPoints: props.market.teamBSpreadPoints,
                  total: americanToDecimal(props.market.teamAOddsTotal),
                  totalPoints: props.market.teamATotalPoints,
                  moneylineFeedPubkey: props.market.teamBOddsMoneylineFeedPubkey,
                  spreadPointsFeedPubkey: props.market.teamBSpreadPointsFeedPubkey,
                  spreadFeedPubkey: props.market.teamBOddsSpreadFeedPubkey,
                  totalFeedPubkey: props.market.teamAOddsTotalFeedPubkey,
                  totalPointsFeedPubkey: props.market.teamATotalPointsFeedPubkey,
                }} />
              </Col>
              {!isMobile && <Col span={6}></Col>}
            </Row>

            <Row>
              <Col span={0} md={2}></Col>
              <Col span={24} md={22}>
                <div style={{position: 'relative'}}>
                  <label className="text-secondary" style={{fontSize:"0.7em", position:'absolute', transform:'translate(0,-50%)', left: '40px'}}>Versus</label>
                </div>
              </Col>
            </Row>

            <Row style={{alignItems:'center'}}>
              <Col span={7}>
                <TeamDetails name={props.market.teamA} logo={"https://storage.googleapis.com/divvy-cdn/MLB/" + props.market.teamA.toLowerCase().replaceAll(" ", "-").replaceAll("-fc", "")  + ".svg"} />
              </Col>
              {!isMobile && <Col span={2}></Col>}
              <Col span={isMobile ? 17 : 9}>
                <OddsSelection marketSide={MarketSide.teamA} market={props.market} selectionTeam={props.market.teamA} otherTeam={props.market.teamB} selection={"teamA"} odds={{
                  moneyline: americanToDecimal(props.market.teamAOddsMoneyline),
                  spread: americanToDecimal(props.market.teamAOddsSpread),
                  spreadPoints: props.market.teamASpreadPoints,
                  total: americanToDecimal(props.market.teamBOddsTotal),
                  totalPoints: props.market.teamBTotalPoints,
                  moneylineFeedPubkey: props.market.teamAOddsMoneylineFeedPubkey,
                  spreadPointsFeedPubkey: props.market.teamASpreadPointsFeedPubkey,
                  spreadFeedPubkey: props.market.teamAOddsSpreadFeedPubkey,
                  totalFeedPubkey: props.market.teamBOddsTotalFeedPubkey,
                  totalPointsFeedPubkey: props.market.teamBTotalPointsFeedPubkey,
                }} />
              </Col>
              {isMobile && <Col span={7} />}
              <Col span={6}></Col>
            </Row>
            { sport?.sportId === 3 &&
            <Row style={{alignItems:'center'}}>
              <Col span={7}>
              </Col>
              {!isMobile && <Col span={2}></Col>}
                <Col span={isMobile ? 6 : 3}>
                  <OddsSelection marketSide={MarketSide.draw} market={props.market} selectionTeam={props.market.draw} otherTeam={props.market.teamA} selection={"Draw"} odds={{
                    moneyline: americanToDecimal(props.market.drawOddsMoneyline),
                    spread: americanToDecimal(props.market.drawOddsSpread),
                    spreadPoints: props.market.drawSpreadPoints,
                    total: americanToDecimal(props.market.drawOddsTotal),
                    totalPoints: props.market.drawTotalPoints,
                    moneylineFeedPubkey: props.market.drawOddsMoneylineFeedPubkey,
                    spreadPointsFeedPubkey: props.market.drawSpreadPointsFeedPubkey,
                    spreadFeedPubkey: props.market.drawOddsSpreadFeedPubkey,
                    totalFeedPubkey: props.market.drawOddsTotalFeedPubkey,
                    totalPointsFeedPubkey: props.market.drawTotalPointsFeedPubkey,
                  }} />
                </Col>
            </Row>
            }
          </Col>
          <Col span={0} md={4}>
            <div className="bet-time-container">
              {getDate(props.market.commenceTime) + ' ' + getTime(props.market.commenceTime)}<br />{getShortTimezone(props.market.commenceTime)}
            </div>
            <div className="market-enter-icon"><RightOutlined /></div>
          </Col>
        </Row>
      </div>
    );
};
