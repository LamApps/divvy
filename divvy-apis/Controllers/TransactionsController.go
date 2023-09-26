//Controllers/Transactions.go
package Controllers

import (
	"github.com/gin-gonic/gin"
)

func WSTransactions(c *gin.Context) {
        serveWs(c.Writer, c.Request)
}