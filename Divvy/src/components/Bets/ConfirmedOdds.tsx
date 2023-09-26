import { Bet, BetType } from '../../constants';
export const ConfirmedOdds = (props: { betType: BetType, bet: Bet }) => {
    const { betType, bet } = props
    const prefix = bet.odds > 0 && '+'
    const { selection, market } = bet

    return (
        <div style={{display:'flex', alignItems:'flex-end'}}>
            <div className="wins-left">
                <p className="text-secondary-wins">
                    Original odds:
                </p>
                <h3>
                    {betType}
                </h3>
            </div>
            <div className="wins-right">
                <h3 style={{ marginTop: 0 }}>
                    {betType === BetType.spread ? selection === "teamA" ? market.teamASpreadPoints : market.teamBSpreadPoints : null}
                    {betType === BetType.total ? selection === "teamA" ? 'U' + market.teamATotalPoints : 'O' + market.teamBTotalPoints : null}
                    {
                        betType === BetType.moneyline 
                        ? <>{prefix}{bet.odds}</>
                        : <>&nbsp;({bet.odds})</>
                    }
                    &nbsp;
                    
                </h3>
            </div>
        </div>
    );
}