//Controllers/MarketParents.go
package Controllers

import (
	"divvy-apis/Models"
	"net/http"

	"github.com/gin-gonic/gin"
)

//GetMarketParentsBySportID ... Get the MarketParents by sport-id
func GetAllSports(c *gin.Context) {
	var SportsData []Models.SportsData
	err := Models.GetAllSports(&SportsData)
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": SportsData})
	}
}
