//Controllers/MarketParents.go
package Controllers

import (
	"divvy-apis/Models"
	"net/http"

	"github.com/gin-gonic/gin"
)

//GetMarketParentsBySportID ... Get the MarketParents by sport-id
func GetMarketParentsBySportID(c *gin.Context) {
	sport_id := c.Params.ByName("sportId")
	var Data []Models.MarketsDataStruct
	err := Models.GetSeasonsBySportID(&Data, sport_id)
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Data})
	}
}
