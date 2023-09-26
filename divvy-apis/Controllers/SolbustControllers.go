//Controllers/MarketParents.go
package Controllers

import (
	"divvy-apis/Models"
	"net/http"

	"github.com/gin-gonic/gin"
)

//GetMarketParentsBySportID ... Get the MarketParents by sport-id
func AddSolbustBet(c *gin.Context) {
	var Bet Models.SolbustBets
	c.ShouldBindJSON(&Bet)
	err := Models.AddSolbustBet(&Bet)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
	} else {
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Posted bet", "bet": Bet})
	}
}
