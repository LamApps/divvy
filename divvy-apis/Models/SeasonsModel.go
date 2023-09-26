//Models/SeasonsModel.go
package Models

type Seasons struct {
	SeasonId     uint   `json:"seasonId"`
	SportId      uint   `json:"sportId"`
	SeasonName   string `json:"seasonName"`
	SeasonActive uint   `json:"seasonActive"`
}

func (b *Seasons) TableName() string {
	return "seasons"
}
