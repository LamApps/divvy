//Controllers/PoolController.go
package Controllers

import (
	"divvy-apis/Models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetPoolPerformance(c *gin.Context) {
	interval := c.Params.ByName("interval")
	var PoolPerformance []Models.Pool
	if i, err := strconv.Atoi(interval); err == nil {
		model_err := Models.GetPoolPerformance(&PoolPerformance, i)
		if model_err != nil {
			c.AbortWithStatus(http.StatusNotFound)
		} else {
			c.JSON(http.StatusOK, gin.H{"data": PoolPerformance})
		}
	} else {
		c.AbortWithStatus(http.StatusInternalServerError)
	}
}

func GetTransactions(c *gin.Context) {
	var transactions []Models.Transactions
	model_err := Models.GetTransactions(&transactions)
	if model_err != nil {
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": transactions})
	}
}
