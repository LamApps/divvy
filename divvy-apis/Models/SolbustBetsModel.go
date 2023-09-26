package Models

type SolbustBets struct {
	Id         uint    `gorm:"primaryKey" json:"id"`
	Bet        float64 `json:bet`
	UserPubkey string  `json:userPubkey`
	Payout     float64 `json:payout`
	Status     uint    `json:"status"`
	PlacedOn   string  `json:"placedOn"`
}

func (b *SolbustBets) TableName() string {
	return "solbust_bets"
}
