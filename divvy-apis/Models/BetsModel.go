//Models/BetsModel.go
package Models

type BetStatus uint

const (
	NEW     BetStatus = 0
	PENDING BetStatus = 1
	GRADED  BetStatus = 2
	SETTLED BetStatus = 3
)

type Bets struct {
	BetId              uint    `json:"betId"`
	MarketId           uint    `json:"marketId"`
	SeasonId           uint    `json:"seasonId"`
	SportId            uint    `json:"sportId"`
	SportName          string  `json:"sportName"`
	SeasonName         string  `json:"seasonName"`
	MarketName         string  `json:"marketName"`
	MarketPubkey       string  `json:"marketPubkey"`
	BetPubkey          string  `json:"betPubkey"`
	Risk               uint64  `json:"risk"`
	Payout             float64 `json:"payout"`
	UserPubkey         string  `json:"userPubkey"`
	Selection          string  `json:"selection"`
	SelectionTeam      string  `json:"selectionTeam"`
	OtherTeam          string  `json:"otherTeam"`
	BetType            string  `json:"betType"`
	Odds               float64 `json:"odds"`
	Status             uint    `json:"status"`
	PlacedOn           string  `json:"placedOn"`
	TeamASpreadPoints  float64 `json:"teamASpreadPoints"`
	TeamBSpreadPoints  float64 `json:"teamBSpreadPoints"`
	TeamATotalPoints   float64 `json:"teamATotalPoints"`
	TeamBTotalPoints   float64 `json:"teamBTotalPoints"`
	LockedLiquidity    string  `json:"lockedLiquidity"`
	AvailableLiquidity string  `json:"availableLiquidity"`
	HtTokensBalance    string  `json:"htTokensBalance"`
	HtPrice            string  `json:"htPrice"`
}

func (b *Bets) TableName() string {
	return "bets"
}
