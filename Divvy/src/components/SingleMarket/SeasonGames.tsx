import { SingleMatchComponent } from "./SingleMatchComponent"
import { Collapse, Divider, Col, Row } from "antd";
import { SeasonName } from "./SeasonName";
import { Market, Season } from "../../constants";
import { Fragment, useState, useEffect } from "react";
import { OddsType } from './OddsType';
const { Panel } = Collapse;
export const SeasonGames = (props: { season: Season, search: string, goToGame: any }) => {
  const [markets, setMarkets] = useState<Market[]>([]);
  useEffect(() => {
    const markets_arr = [...props.season.markets]
    markets_arr.sort(function(a, b){return a.commenceTime - b.commenceTime});
    setMarkets(markets_arr)
  }, props.season.markets)
  return (
    <div className="single-market">
      <Row>
        <Col span={24}>
          <Collapse defaultActiveKey={"1"} accordion={true} style={{ display: "grid" }} ghost={true} expandIconPosition="right">
            <Panel header={<SeasonName name={props.season.season.seasonName} matches={props.season.markets.length} />} key="1">
              {markets.map((value: Market, index: number) => {
                if(value.teamA.concat(value.teamB).toLowerCase().includes(props.search.toLowerCase())) {
                  return (
                    <Fragment key={value.marketId}>
                      <div className="market-container" onClick={() => {props.goToGame(value.marketId)}}><SingleMatchComponent market={value} /></div>
                      <Divider style={{ color: "gray", margin: '10px 0' }} />
                    </Fragment>
                  )
                }
              })}
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </div>
  )
};
