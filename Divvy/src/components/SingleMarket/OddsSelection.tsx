import { useContext } from "react";
import { Col, Row } from "antd";
import { SportContext } from "../../contexts/sport";
import { HousePoolContext } from "../../contexts/sol/hpliquidity";
import { BetStateContext } from "../../contexts/sol/betstate";
import { HPTokenContext } from "../../contexts/sol/hptoken";
import { LAMPORTS_PER_USDC } from "../../constants/math";
import { tokenAmountToString } from "../../constants";
import { Odds, BetType, Market, Bet, MarketSide, BetStatus } from "../../constants";
import { BetsContext } from "../../contexts/bets";
import { useMediaQuery } from "../../utils/utils";
export const OddsSelection = (props: { market: Market, selection: string, odds: Odds, otherTeam: string, selectionTeam: string, marketSide: MarketSide }) => {
    const bets = useContext(BetsContext);
    const { htBalance } = useContext(HousePoolContext);
    const { htSupply } = useContext(HPTokenContext);
    const { liveLiquidity, lockedLiquidity } = useContext(BetStateContext)
    const { sport, changeSport } = useContext(SportContext)
    let isMobile = useMediaQuery('(max-width: 400px)')

    const setSlip = (betType: BetType, odds: number, oddsFeed: string, marketPubkey: string, points: number) => {
        if (containsBet(betType)) {
            const existing = bets?.findBets(props.market.marketId, props.marketSide, betType, BetStatus.Current);
            if(existing && existing.length !== 0) {
                bets?.removeBet(existing[0].betId);
            }
        }
        else {
            let bet: Bet;
            bet = {
                betId: Math.random() * 10,
                marketId: props.market.marketId,
                seasonId: props.market.seasonId,
                sportId: props.market.sportId,
                marketPubkey: marketPubkey,
                risk: 0,
                payout: 0,
                userPubkey: "uerguerbgub",
                selection: props.selection,
                odds: odds,
                status: BetStatus.Current,
                market: props.market,
                oddsPubKey: oddsFeed,
                selectionTeam: props.selectionTeam,
                otherTeam: props.otherTeam,
                marketSide: props.marketSide,
                betType: betType,
                sportName: sport?.sportName,
                seasonName: props.market.seasonName,
                marketName: props.market.teamA + " vs " + props.market.teamB,
                placedOn: (new Date()).toString(),
                points: points,
                lockedLiquidity: tokenAmountToString(lockedLiquidity + liveLiquidity),
                availableLiquidity: tokenAmountToString(htBalance-lockedLiquidity),
                htTokensBalance: (htSupply/LAMPORTS_PER_USDC).toString(),
                htPrice: ((htBalance + lockedLiquidity) / htSupply).toString()
            }
            bets?.addBet(bet)
        }
    }

    const containsBet = (betType: BetType) => {
        return bets?.containsBet(props.market.marketId, props.marketSide, betType, BetStatus.Current) ?? false;
    }

    return (
      <Row style={{display:'flex', alignItems:'center', margin: '1px 0'}}>
        <Col span={props.marketSide === MarketSide.draw ? 24 : 8} style={{padding: 0}}
            onClick={(e) => {e.stopPropagation();setSlip(BetType.moneyline, props.odds.moneyline, props.odds.moneylineFeedPubkey, props.market.moneylineMarketPubkey, 0);}}>
          <div className={containsBet(BetType.moneyline) ? "odds odds-active" : "odds"} style={{margin: '0 0.5em', borderRadius: props.marketSide !== MarketSide.draw ? '22.5px' : '22.5px'}}>
            <label>{ props.marketSide === MarketSide.draw ? '(Draw)' : ''}</label>
            <b style={{fontSize: '1em'}}>{`${props.odds.moneyline >= 0 ? "+" : ""}${props.odds.moneyline.toFixed(2)}`}</b>
          </div>
        </Col>
        { props.marketSide != MarketSide.draw && 
        <>
          {/* TODO: add after we enable spreads: onClick={(e) => {e.stopPropagation();setSlip(BetType.spread, props.odds.spread, props.odds.spreadFeedPubkey, props.market.spreadMarketPubKey)}} */}
          <Col onClick={(e) => {e.stopPropagation();setSlip(BetType.spread, props.odds.spread, props.odds.spreadFeedPubkey, props.market.moneylineMarketPubkey, props.odds.spreadPoints);}} span={8} style={{padding: 0}} >
            <div className={containsBet(BetType.spread) ? "odds odds-active" : "odds"} style={{margin: '0 0.5em', borderRadius: '22.5px'}}>
              <label></label>
              <b style={{fontSize: '1em'}}>{`${props.odds.spreadPoints >= 0 ? "+" : ""}${String(props.odds.spreadPoints.toFixed(2))} ${isMobile ? '' : `(${String(props.odds.spread.toFixed(2))})`}`}</b>
            </div>
          </Col>
          <Col onClick={(e) => {e.stopPropagation();setSlip(BetType.total, props.odds.total, props.odds.totalFeedPubkey, props.market.moneylineMarketPubkey, props.odds.totalPoints);}} span={8} style={{padding: 0}} >
            <div className={containsBet(BetType.total) ? "odds odds-active" : "odds"} style={{margin: '0 0.5em', borderRadius: '22.5px'}}>
              <label></label>
              <b style={{fontSize: '1em'}}>{`${props.marketSide === MarketSide.teamB ? "O" : "U"} ${Math.abs(props.odds.totalPoints).toFixed(2)} ${isMobile ? '' : `(${props.odds.total.toFixed(2)})`}`}</b>
            </div>
          </Col>
        </>
        }
      </Row>
    )
};
