//Models/Queries.go
package Models

import (
	"divvy-apis/Config"
	"fmt"
)

func GetSeasonsBySportID(Data *[]MarketsDataStruct, sport_id string) (err error) {
	var Seasons []Seasons
	if err = Config.DB.Raw("SELECT * FROM seasons WHERE sport_id=? AND season_active=1", sport_id).Find(&Seasons).Error; err != nil {
		return err
	}
	var data []MarketsDataStruct
	var Markets []Markets
	for index, element := range Seasons {
		fmt.Println(index)
		query := `SELECT * FROM markets
			WHERE 
				season_id=? AND (active=?)
				AND
				winner_feed_pubkey IS NOT NULL
				AND
				team_a_odds_moneyline_feed_pubkey IS NOT NULL
				AND
				team_b_odds_moneyline_feed_pubkey IS NOT NULL
				AND
				draw_odds_moneyline_feed_pubkey IS NOT NULL
				AND
				team_a_total_points_feed_pubkey IS NOT NULL
				AND
				team_b_total_points_feed_pubkey IS NOT NULL
				AND
				team_a_odds_total_feed_pubkey IS NOT NULL
				AND
				team_b_odds_total_feed_pubkey IS NOT NULL
				AND
				team_a_spread_points_feed_pubkey IS NOT NULL
				AND
				team_b_spread_points_feed_pubkey IS NOT NULL
				AND
				team_a_odds_spread_feed_pubkey IS NOT NULL
				AND
				team_b_odds_spread_feed_pubkey IS NOT NULL
				AND
				team_a_score_feed_pubkey IS NOT NULL
				AND
				team_b_score_feed_pubkey IS NOT NULL
				AND
				moneyline_market_pubkey IS NOT NULL
			ORDER BY commence_time DESC;
		`
		if err = Config.DB.Raw(query, element.SeasonId, NOT_COMMENCED).Find(&Markets).Error; err != nil {
			return err
		}
		var MarketData = new(MarketsDataStruct)
		MarketData.Season = element
		MarketData.Markets = Markets
		data = append(data, *MarketData)
	}
	*Data = data
	return nil
}

func GetAllSports(SportsData *[]SportsData) (err error) {
	if err = Config.DB.Raw("SELECT s.sport_name, s.sport_id, s.sport_logo, COUNT(m.market_id) as count FROM sports s LEFT JOIN markets m ON m.sport_id = s.sport_id AND m.active=?  GROUP BY s.sport_id", NOT_COMMENCED).Scan(&SportsData).Error; err != nil {
		return err
	}
	return nil
}

func GetMarket(Market *Markets, MarketId string) (err error) {
	if err = Config.DB.Where("market_id = ?", MarketId).Find(Market).Error; err != nil {
		return err
	}
	return nil
}

func GetBetsHistory(BetsHistory *[]BetsHistory, UserPubkey string) (err error) {
	if err = Config.DB.Raw("SELECT * FROM bets WHERE bets.user_pubkey = ?", UserPubkey).Scan(&BetsHistory).Error; err != nil {
		return err
	}
	return nil
}

func PostBet(Bet Bets) (err error) {
	if err = Config.DB.Select(`user_pubkey`, `selection`, `bet_type`, `risk`, `odds`, `season_id`, `sport_id`, `market_id`, `status`, `market_pubkey`, `bet_pubkey`, `payout`, `selection_team`, `other_team`, `sport_name`, `season_name`, `market_name`, `placed_on`, `team_a_spread_points`, `team_b_spread_points`, `team_a_total_points`, `team_b_total_points`).Create(&Bet).Error; err != nil {
		return err
	}
	return nil
}

func GetPoolPerformance(PoolPerformance *[]Pool, interval int) (err error) {
	if err = Config.DB.Where("day >= ?", interval).Find(&PoolPerformance).Error; err != nil {
		return err
	}
	return nil
}

func GetTransactions(transactions *[]Transactions) (err error) {
	if err = Config.DB.Find(&transactions).Error; err != nil {
		return err
	}
	return nil
}

func PostTransaction(Transaction *Transactions) (err error) {
	if err = Config.DB.Select(`type`, `pubkey`, `match`, `odds`, `odds_type`, `amount`, `time`).Create(&Transaction).Error; err != nil {
		return err
	}
	return nil
}

func GetLiveMarkets(LiveMarkets *[]Markets) (err error) {
	if err = Config.DB.Raw("SELECT * FROM markets WHERE active=? ORDER BY commence_time DESC", COMMENCED).Find(&LiveMarkets).Error; err != nil {
		return err
	}
	return nil
}

func UpdateMarketById(market *Markets) (err error) {
	if err = Config.DB.Model(&market).Where("market_id = ?", market.MarketId).Update(&market).Error; err != nil {
		return err
	}
	return nil
}

func AddSolbustBet(bet *SolbustBets) (err error) {
	if err = Config.DB.Select(`bet`, `user_pubkey`, `payout`, `status`, `placed_on`).Create(&bet).Error; err != nil {
		return err
	}
	return nil
}

func GetCommencedMarkets(markets *[]Markets) (err error) {
	if err = Config.DB.Where("active = 4").Find(markets).Error; err != nil {
		return err
	}
	return nil
}
