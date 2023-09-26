import { Row, Col } from "antd";
import { Market, MarketSide } from "../../constants";
import { useGetLiveMarketsQuery } from "../../store/getLiveMarkets"
import { getDate, getTime, getShortTimezone } from "../../utils/date";
import { GoBack } from "../Common/GoBack";
import { Loader } from "../Loader"
import { OddsSelection } from "../SingleMarket/OddsSelection";
import { OddsType } from "../SingleMarket/OddsType";
import { TeamDetails } from "../SingleMarket/TeamDetails";

export const LiveMarkets = (props: {game: number, backToSeason: any}) => {
    const { data, error, isLoading } = useGetLiveMarketsQuery(null);
    return (
        <div style={{minHeight: '3em'}}>
            {props.game != -1 && <div onClick={() => props.backToSeason(-1)}><GoBack path={`${'/'}`} label="Back to Betting"/></div>}
            {/* <h2>Live Games</h2>
            {isLoading ? <Loader /> :
                <div className="carousel" style={{ display: "flex" }}>
                    {data?.map((market: Market) => {
                        return (
                            <div className="carousel-text">
                                <Row>
                                    <Col span={24}>
                                        <TeamDetails name={market.teamA} logo={"https://storage.googleapis.com/divvy-cdn/" + market.seasonName + "/" + market.teamA.replaceAll(" ", "-").replaceAll("FC",  "") + ".svg"} />
                                    </Col>
                                    <Col span={24}>
                                        <p className="text-secondary" style={{ marginTop: -4, marginBottom: -5, fontSize: "0.7em", marginLeft: "20%" }}>VS</p>
                                    </Col>
                                    <Col span={24}>
                                        <TeamDetails name={market.teamB} logo={"https://storage.googleapis.com/divvy-cdn/" + market.seasonName + "/" + market.teamB.replaceAll(" ", "-").replaceAll("FC", "") + ".svg"} />
                                    </Col>
                                </Row>
                            </div>
                        );
                    })}
                </div >
            } */}
        </div >
    )
}