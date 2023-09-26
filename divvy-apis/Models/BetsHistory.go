//Models/BetsHistory.go
package Models

type BetsHistory struct {
	BetId             uint    `json:"betId"`
	MarketId          uint    `json:"marketId"`
	SeasonId          uint    `json:"seasonId"`
	SportId           uint    `json:"sportId"`
	MarketPubkey      string  `json:"marketPubkey"`
	BetPubkey         string  `json:"betPubkey"`
	Risk              uint64  `json:"risk"`
	Payout            float64 `json:"payout"`
	UserPubkey        string  `json:"userPubkey"`
	Selection         string  `json:"selection"`
	SelectionTeam     string  `json:"selectionTeam"`
	OtherTeam         string  `json:"otherTeam"`
	Sport             string  `json:"sport"`
	Season            string  `json:"season"`
	BetType           string  `json:"betType"`
	Odds              float64 `json:"odds"`
	Status            uint    `json:"status"`
	MarketName        string  `json:"marketName"`
	SportName         string  `json:"sportName"`
	SeasonName        string  `json:"seasonName"`
	Market            Markets `json:"market"`
	PlacedOn          string  `json:"placedOn"`
	TeamASpreadPoints float64 `json:"teamASpreadPoints"`
	TeamBSpreadPoints float64 `json:"teamBSpreadPoints"`
	TeamATotalPoints  float64 `json:"teamATotalPoints"`
	TeamBTotalPoints  float64 `json:"teamBTotalPoints"`
}
