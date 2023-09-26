import { Divider, Col, Row } from "antd";
import { SeasonName } from "./SeasonName";
import { useContext, useState, useEffect } from "react";
import { TeamDetails } from "./TeamDetails"
import { OddsSelection } from './OddsSelection';
import { americanToDecimal, Market, Season, MarketSide } from '../../constants';
import { getDate, getShortTimezone, getTime } from '../../utils/date';
import { SportContext } from "../../contexts/sport";
import { useMediaQuery } from "../../utils/utils";

export const SeasonGamesMatch = (props: { season: Season, matchId: number }) => {
  const [market, setMarket] = useState<Market>();
  const { sport, changeSport } = useContext(SportContext)
  let isMobile = useMediaQuery('(max-width: 400px)');

  useEffect(() => {
    for (const data of props.season.markets) {
      console.log("props", props)
      if (data.marketId === props.matchId) {
        setMarket(data);
        break;
      }
    }
  }, props.season.markets)
  return (
    <div className="market-match">
      <div className="season-header" style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
        <h2 style={{flex: 3}}>{props.season.season.seasonName}</h2>
        {!isMobile && <div style={{flex: 12}}></div>}
        <div className="text-secondary" style={{flex: 2}}>
          {market && 
            `${getDate(market.commenceTime)} ${getTime(market.commenceTime)} ${getShortTimezone(market.commenceTime)}`
          }
        </div>
      </div>
      <Divider style={{ color: "gray", margin: '10px 0' }} />
      {market && 
        <div className="single-match">
          <Row>
            {!isMobile ?
            <Col span={24} md={24}>
              <Row style={{alignItems:'center', marginTop: '2em', justifyContent: 'space-between', padding: '0 3em'}}>
                <Col span={7} className="native-team">
                  <TeamDetails name={market.teamB} logo={"https://storage.googleapis.com/divvy-cdn/MLB/" + market.teamB.toLowerCase().replaceAll(" ", "-").replaceAll("-fc", "")  + ".svg"} />
                </Col>
                <Col span={4} style={{textAlign: 'center'}}>
                  <label className="text-secondary" style={{fontSize:"0.7em"}}>Versus</label>
                </Col>
                <Col span={7} className="home-team">
                  <TeamDetails name={market.teamA} logo={"https://storage.googleapis.com/divvy-cdn/MLB/" + market.teamA.toLowerCase().replaceAll(" ", "-").replaceAll("-fc", "")  + ".svg"} />
                </Col>
              </Row>

              <Row style={{alignItems:'center', marginBottom: '2em', justifyContent: 'space-evenly'}}>
                <Col span={isMobile ? 17 : 9}>
                  <OddsSelection marketSide={MarketSide.teamB} market={market} selectionTeam={market.teamB} otherTeam={market.teamA} selection={"teamB"} odds={{
                    moneyline: americanToDecimal(market.teamBOddsMoneyline),
                    spread: americanToDecimal(market.teamBOddsSpread),
                    spreadPoints: market.teamBSpreadPoints,
                    total: americanToDecimal(market.teamAOddsTotal),
                    totalPoints: market.teamATotalPoints,
                    moneylineFeedPubkey: market.teamBOddsMoneylineFeedPubkey,
                    spreadPointsFeedPubkey: market.teamBSpreadPointsFeedPubkey,
                    spreadFeedPubkey: market.teamBOddsSpreadFeedPubkey,
                    totalFeedPubkey: market.teamAOddsTotalFeedPubkey,
                    totalPointsFeedPubkey: market.teamATotalPointsFeedPubkey,
                  }} />
                </Col>
                { sport?.sportId === 3 &&
                  <Col span={isMobile ? 6 : 3}>
                    <OddsSelection marketSide={MarketSide.draw} market={market} selectionTeam={market.draw} otherTeam={market.teamA} selection={"Draw"} odds={{
                      moneyline: americanToDecimal(market.drawOddsMoneyline),
                      spread: americanToDecimal(market.drawOddsSpread),
                      spreadPoints: market.drawSpreadPoints,
                      total: americanToDecimal(market.drawOddsTotal),
                      totalPoints: market.drawTotalPoints,
                      moneylineFeedPubkey: market.drawOddsMoneylineFeedPubkey,
                      spreadPointsFeedPubkey: market.drawSpreadPointsFeedPubkey,
                      spreadFeedPubkey: market.drawOddsSpreadFeedPubkey,
                      totalFeedPubkey: market.drawOddsTotalFeedPubkey,
                      totalPointsFeedPubkey: market.drawTotalPointsFeedPubkey,
                    }} />
                  </Col>
                }
                <Col span={isMobile ? 17 : 9}>
                  <OddsSelection marketSide={MarketSide.teamA} market={market} selectionTeam={market.teamA} otherTeam={market.teamB} selection={"teamA"} odds={{
                    moneyline: americanToDecimal(market.teamAOddsMoneyline),
                    spread: americanToDecimal(market.teamAOddsSpread),
                    spreadPoints: market.teamASpreadPoints,
                    total: americanToDecimal(market.teamBOddsTotal),
                    totalPoints: market.teamBTotalPoints,
                    moneylineFeedPubkey: market.teamAOddsMoneylineFeedPubkey,
                    spreadPointsFeedPubkey: market.teamASpreadPointsFeedPubkey,
                    spreadFeedPubkey: market.teamAOddsSpreadFeedPubkey,
                    totalFeedPubkey: market.teamBOddsTotalFeedPubkey,
                    totalPointsFeedPubkey: market.teamBTotalPointsFeedPubkey,
                  }} />
                </Col>
              </Row>
            </Col>
            :
            <Col span={24} md={24}>
              <Row style={{alignItems:'center', marginTop: '2em', justifyContent: 'space-between'}}>
                <Col span={7} className="native-team">
                  <TeamDetails name={market.teamB} logo={"https://storage.googleapis.com/divvy-cdn/MLB/" + market.teamB.toLowerCase().replaceAll(" ", "-").replaceAll("-fc", "")  + ".svg"} />
                </Col>
                <Col span={isMobile ? 17 : 9}>
                  <OddsSelection marketSide={MarketSide.teamB} market={market} selectionTeam={market.teamB} otherTeam={market.teamA} selection={"teamB"} odds={{
                    moneyline: americanToDecimal(market.teamBOddsMoneyline),
                    spread: americanToDecimal(market.teamBOddsSpread),
                    spreadPoints: market.teamBSpreadPoints,
                    total: americanToDecimal(market.teamAOddsTotal),
                    totalPoints: market.teamATotalPoints,
                    moneylineFeedPubkey: market.teamBOddsMoneylineFeedPubkey,
                    spreadPointsFeedPubkey: market.teamBSpreadPointsFeedPubkey,
                    spreadFeedPubkey: market.teamBOddsSpreadFeedPubkey,
                    totalFeedPubkey: market.teamAOddsTotalFeedPubkey,
                    totalPointsFeedPubkey: market.teamATotalPointsFeedPubkey,
                  }} />
                </Col>
              </Row>

              <Row style={{margin: '2em 0'}}>
                <Col span={7} style={{display: 'flex', justifyContent: 'center'}}>
                  <label className="text-secondary" style={{fontSize:"0.7em", alignSelf: 'center'}}>Versus</label>
                </Col>
                { sport?.sportId === 3 &&
                  <Col span={isMobile ? 6 : 3}>
                    <OddsSelection marketSide={MarketSide.draw} market={market} selectionTeam={market.draw} otherTeam={market.teamA} selection={"Draw"} odds={{
                      moneyline: americanToDecimal(market.drawOddsMoneyline),
                      spread: americanToDecimal(market.drawOddsSpread),
                      spreadPoints: market.drawSpreadPoints,
                      total: americanToDecimal(market.drawOddsTotal),
                      totalPoints: market.drawTotalPoints,
                      moneylineFeedPubkey: market.drawOddsMoneylineFeedPubkey,
                      spreadPointsFeedPubkey: market.drawSpreadPointsFeedPubkey,
                      spreadFeedPubkey: market.drawOddsSpreadFeedPubkey,
                      totalFeedPubkey: market.drawOddsTotalFeedPubkey,
                      totalPointsFeedPubkey: market.drawTotalPointsFeedPubkey,
                    }} />
                  </Col>
                }
              </Row>

              <Row style={{alignItems:'center', marginBottom: '2em', justifyContent: 'space-evenly'}}>
                <Col span={7} className="home-team">
                  <TeamDetails name={market.teamA} logo={"https://storage.googleapis.com/divvy-cdn/MLB/" + market.teamA.toLowerCase().replaceAll(" ", "-").replaceAll("-fc", "")  + ".svg"} />
                </Col>
                <Col span={isMobile ? 17 : 9}>
                  <OddsSelection marketSide={MarketSide.teamA} market={market} selectionTeam={market.teamA} otherTeam={market.teamB} selection={"teamA"} odds={{
                    moneyline: americanToDecimal(market.teamAOddsMoneyline),
                    spread: americanToDecimal(market.teamAOddsSpread),
                    spreadPoints: market.teamASpreadPoints,
                    total: americanToDecimal(market.teamBOddsTotal),
                    totalPoints: market.teamBTotalPoints,
                    moneylineFeedPubkey: market.teamAOddsMoneylineFeedPubkey,
                    spreadPointsFeedPubkey: market.teamASpreadPointsFeedPubkey,
                    spreadFeedPubkey: market.teamAOddsSpreadFeedPubkey,
                    totalFeedPubkey: market.teamBOddsTotalFeedPubkey,
                    totalPointsFeedPubkey: market.teamBTotalPointsFeedPubkey,
                  }} />
                </Col>
              </Row>
            </Col>
          }
          </Row>
        </div>
      }
      <Divider style={{ color: "gray", margin: '10px 0' }} />
      <div style={{marginTop: '3em'}}>
        <h2>
        Real time stats coming soon
        </h2>
      </div>
    </div>
  )
};
