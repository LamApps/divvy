//Models/SportdData.go
package Models

type SportsData struct {
	SportName string `json:"sportName"`
	SportLogo string `json:"sportLogo"`
	SportId   uint   `json:"sportId"`
	Count     uint   `json:"count"`
}
