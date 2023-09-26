//Models/TransactionsModel.go
package Models

type Transactions struct {
	Id         uint   `json:"id"`
	Type       string   `json:"type"`
	Pubkey     string `json:"pubkey"`
	Match      string   `json:"match"`
	Odds       int `json:"odds"`
	Odds_type  string `json:"odds_type"`
	Amount     int `json:"amount"`
	Time       string `json:"time"`
}

func (b *Transactions) TableName() string {
	return "transactions"
}
