//Controllers/Markets.go
package Controllers

import (
	"divvy-apis/GoogleSheet"
	"divvy-apis/Models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetWinner(c *gin.Context) {
	marketId := c.Params.ByName("marketId")
	var Market Models.Markets
	err := Models.GetMarket(&Market, marketId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Market.Winner})
	}
}

func GetMoneylineTeamAOdds(c *gin.Context) {
	marketId := c.Params.ByName("marketId")
	var Market Models.Markets
	err := Models.GetMarket(&Market, marketId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Market.TeamAOddsMoneyline})
	}
}

func GetMoneylineTeamBOdds(c *gin.Context) {
	marketId := c.Params.ByName("marketId")
	var Market Models.Markets
	err := Models.GetMarket(&Market, marketId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Market.TeamBOddsMoneyline})
	}
}

func GetMoneylineDrawOdds(c *gin.Context) {
	marketId := c.Params.ByName("marketId")
	var Market Models.Markets
	err := Models.GetMarket(&Market, marketId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Market.DrawOddsMoneyline})
	}
}

func GetTotalTeamA(c *gin.Context) {
	marketId := c.Params.ByName("marketId")
	var Market Models.Markets
	err := Models.GetMarket(&Market, marketId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Market.TeamATotalPoints})
	}
}

func GetTotalTeamB(c *gin.Context) {
	marketId := c.Params.ByName("marketId")
	var Market Models.Markets
	err := Models.GetMarket(&Market, marketId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Market.TeamBTotalPoints})
	}
}

func GetTotalTeamAOdds(c *gin.Context) {
	marketId := c.Params.ByName("marketId")
	var Market Models.Markets
	err := Models.GetMarket(&Market, marketId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Market.TeamAOddsTotal})
	}
}

func GetTotalTeamBOdds(c *gin.Context) {
	marketId := c.Params.ByName("marketId")
	var Market Models.Markets
	err := Models.GetMarket(&Market, marketId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Market.TeamBOddsTotal})
	}
}

func GetSpreadTeamA(c *gin.Context) {
	marketId := c.Params.ByName("marketId")
	var Market Models.Markets
	err := Models.GetMarket(&Market, marketId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Market.TeamASpreadPoints})
	}
}

func GetSpreadTeamB(c *gin.Context) {
	marketId := c.Params.ByName("marketId")
	var Market Models.Markets
	err := Models.GetMarket(&Market, marketId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Market.TeamBSpreadPoints})
	}
}

func GetSpreadTeamAOdds(c *gin.Context) {
	marketId := c.Params.ByName("marketId")
	var Market Models.Markets
	err := Models.GetMarket(&Market, marketId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Market.TeamAOddsSpread})
	}
}

func GetSpreadTeamBOdds(c *gin.Context) {
	marketId := c.Params.ByName("marketId")
	var Market Models.Markets
	err := Models.GetMarket(&Market, marketId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Market.TeamBOddsSpread})
	}
}

func GetScoreTeamA(c *gin.Context) {
	marketId := c.Params.ByName("marketId")
	var Market Models.Markets
	err := Models.GetMarket(&Market, marketId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Market.TeamAScore})
	}
}

func GetScoreTeamB(c *gin.Context) {
	marketId := c.Params.ByName("marketId")
	var Market Models.Markets
	err := Models.GetMarket(&Market, marketId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": Market.TeamBScore})
	}
}

func GetUserBetsHistory(c *gin.Context) {
	userAddr := c.Params.ByName("userAddr")
	var BetsHistory []Models.BetsHistory
	err := Models.GetBetsHistory(&BetsHistory, userAddr)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": BetsHistory})
	}
}

func PostUserBetsHistory(c *gin.Context) {
	var Bets Models.Bets
	c.ShouldBindJSON(&Bets)
	GoogleSheet.AddTransactionToSheet(Bets)
	err := Models.PostBet(Bets)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": "success"})
	}
}

func GetLiveMarkets(c *gin.Context) {
	var LiveMarkets []Models.Markets
	err := Models.GetLiveMarkets(&LiveMarkets)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{"data": LiveMarkets})
	}
}

func UpdateMarket(c *gin.Context) {
	var market Models.Markets
	c.ShouldBindJSON(&market)
	err := Models.UpdateMarketById(&market)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
	} else {
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Updated data"})
	}
}

func GetCommencedMarkets(c *gin.Context) {
	var markets []Models.Markets
	err := Models.GetCommencedMarkets(&markets)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
	} else {
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Successful", "data": markets})
	}
}
