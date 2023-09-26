//Models/PoolModel.go
package Models

type Pool struct {
	Id      uint   `json:"id"`
	Day     string   `json:"day"`
	Balance int `json:"balance"`
	Earning int   `json:"earning"`
	Volume  int `json:"volume"`
}

func (b *Pool) TableName() string {
	return "pool"
}
