//Models/MarketsData.go
package Models

type MarketsDataStruct struct {
	Season  Seasons   `json:"season"`
	Markets []Markets `json:"markets"`
}
