//Models/MarketsModel.go
package Models

type Markets struct {
	MarketId                     uint    `json:"marketId"`
	SeasonId                     uint    `json:"seasonId"`
	SportId                      uint    `json:"sportId"`
	ApiId                        uint    `json:"apiId"`
	LastUpdated                  uint64  `json:"lastUpdated"`
	Active                       uint    `json:"active"`
	TeamA                        string  `json:"teamA"`
	TeamB                        string  `json:"teamB"`
	HomeTeam                     string  `json:"homeTeam"`
	FavoriteTeam                 string  `json:"favoriteTeam"`
	CommenceTime                 uint64  `json:"commenceTime"`
	EndTime                      uint64  `json:"endTime"`
	Winner                       uint    `json:"winner"`
	WinnerFeedPubkey             string  `json:"winnerFeedPubkey"`
	MoneylineMarketPubkey        string  `json:"moneylineMarketPubkey"`
	TeamAOddsMoneyline           float64 `json:"teamAOddsMoneyline"`
	TeamAOddsMoneylineFeedPubkey string  `json:"teamAOddsMoneylineFeedPubkey"`
	TeamBOddsMoneyline           float64 `json:"teamBOddsMoneyline"`
	TeamBOddsMoneylineFeedPubkey string  `json:"teamBOddsMoneylineFeedPubkey"`
	DrawOddsMoneyline            float64 `json:"drawOddsMoneyline"`
	DrawOddsMoneylineFeedPubkey  string  `json:"drawOddsMoneylineFeedPubkey"`
	TotalMarketPubkey            string  `json:"totalMarketPubkey"`
	TeamATotalPoints             float64 `json:"teamATotalPoints"`
	TeamATotalPointsFeedPubkey   string  `json:"teamATotalPointsFeedPubkey"`
	TeamBTotalPoints             float64 `json:"teamBTotalPoints"`
	TeamBTotalPointsFeedPubkey   string  `json:"teamBTotalPointsFeedPubkey"`
	TeamAOddsTotal               float64 `json:"teamAOddsTotal"`
	TeamAOddsTotalFeedPubkey     string  `json:"teamAOddsTotalFeedPubkey"`
	TeamBOddsTotal               float64 `json:"teamBOddsTotal"`
	TeamBOddsTotalFeedPubkey     string  `json:"teamBOddsTotalFeedPubkey"`
	SpreadMarketPubkey           string  `json:"spreadMarketPubkey"`
	TeamASpreadPoints            float64 `json:"teamASpreadPoints"`
	TeamASpreadPointsFeedPubkey  string  `json:"teamASpreadPointsFeedPubkey"`
	TeamBSpreadPoints            float64 `json:"teamBSpreadPoints"`
	TeamBSpreadPointsFeedPubkey  string  `json:"teamBSpreadPointsFeedPubkey"`
	TeamAOddsSpread              float64 `json:"teamAOddsSpread"`
	TeamAOddsSpreadFeedPubkey    string  `json:"teamAOddsSpreadFeedPubkey"`
	TeamBOddsSpread              float64 `json:"teamBOddsSpread"`
	TeamBOddsSpreadFeedPubkey    string  `json:"teamBOddsSpreadFeedPubkey"`
	TeamAScore                   float64 `json:"teamAScore"`
	TeamAScoreFeedPubkey         string  `json:"teamAScoreFeedPubkey"`
	TeamBScore                   float64 `json:"teamBScore"`
	TeamBScoreFeedPubkey         string  `json:"teamBScoreFeedPubkey"`
}

func (b *Markets) TableName() string {
	return "markets"
}
