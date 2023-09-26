import { Button } from 'antd'
import { useContext } from 'react';
import { LABELS } from '../../constants';
import { Sports } from '../../constants/Sports';
import { SportContext } from '../../contexts/sport';
import { useGetSportsQuery } from '../../store/sports';
import { Loader } from '../Loader';
import { BETS_VIEW_PATH } from "../../constants"
import { useHistory } from 'react-router';
export const MarketsLink = ({ search = "" as any }) => {
    const { data, error, isLoading } = useGetSportsQuery(null)
    const { sport, changeSport } = useContext(SportContext)
    const history = useHistory();

    const sportClicked = (Sport: Sports) => {
        changeSport(Sport);
        history.push(BETS_VIEW_PATH);
    }

    const MarketsUI = () => {
        let market: JSX.Element[] = [];
        data?.forEach((sportData) => {
            if (sportData.sportName.toLowerCase().includes(search.toLowerCase())) {
                market.push(
                    <div onClick={() => { sportClicked(sportData) }} className={sport?.sportId === sportData.sportId ? "selected-search-item" : "search-item selected"} key={sportData.sportId}>
                        <Button className="search-button" ghost type="default">
                            <div className="search-button-data">
                                <div className="search-left">
                                    {sportData.sportName}
                                </div>
                                <div className="search-right text-secondary">
                                    {sportData.count}
                                </div>
                            </div>
                        </Button>
                    </div>
                )
            }
        })
        return market;
    }
    return (
        <div className="sidebar-section sidebar-section-markets" style={{padding: '1em 0.5em'}}>
            {error ? LABELS.SERVER_ERROR : null}
            {isLoading ? <Loader /> : null}
            {MarketsUI()}
        </div>
    );
};
