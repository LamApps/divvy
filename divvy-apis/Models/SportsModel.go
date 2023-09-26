//Models/SportsModel.go
package Models

type Sports struct {
	SportName string `json:"sportName"`
	SportId   uint   `json:"sportId"`
	SportLogo string `json:sportLogo`
}

func (b *Sports) TableName() string {
	return "sports"
}
