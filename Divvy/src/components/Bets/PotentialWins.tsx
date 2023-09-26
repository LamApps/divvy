import { americanToDecimal, Bet, LAMPORTS_PER_USDC } from '../../constants';
import { round } from '../../utils/numbers';

export const PotentialWins = (props: { betSlip: Bet }) => {
    return (
        <div>
            <div className="wins-left">
                <p className="text-secondary-wins">
                    Wager
                </p>
                <h3 style={{overflowWrap:'anywhere'}}>
                    {round(props.betSlip.risk / LAMPORTS_PER_USDC)} USDC
                </h3>
            </div>
            <div className="wins-right">
                <p className="text-secondary-wins">
                    To win
                </p>
                <h3 style={{overflowWrap:'anywhere'}}>
                    {round((props.betSlip.risk / LAMPORTS_PER_USDC) * props.betSlip.odds)} USDC
                </h3>
            </div>
        </div>
    );
}