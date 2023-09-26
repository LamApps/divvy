//Routes/Routes.go
package Routes

import (
	"divvy-apis/Controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

//SetupRouter ... Configure routes
func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		// change allow all origins later
		AllowAllOrigins: true,
		AllowMethods:    []string{"GET", "POST"},
		AllowHeaders:    []string{"Content-Type"},
	}))
	grp1 := r.Group("/")
	{
		grp1.GET("seasons/:sportId", Controllers.GetMarketParentsBySportID)
		grp1.GET("sports", Controllers.GetAllSports)
		grp1.GET("winner/:marketId", Controllers.GetWinner)
		grp1.GET("livemarkets", Controllers.GetLiveMarkets)
		//Group  later
		grp1.GET("moneyline/:marketId/teamA", Controllers.GetMoneylineTeamAOdds)
		grp1.GET("moneyline/:marketId/teamB", Controllers.GetMoneylineTeamBOdds)
		grp1.GET("moneyline/:marketId/draw", Controllers.GetMoneylineDrawOdds)
		grp1.GET("total/:marketId/teamA", Controllers.GetTotalTeamA)
		grp1.GET("total/:marketId/teamB", Controllers.GetTotalTeamB)
		grp1.GET("total_odds/:marketId/teamA", Controllers.GetTotalTeamAOdds)
		grp1.GET("total_odds/:marketId/teamB", Controllers.GetTotalTeamBOdds)
		grp1.GET("spread/:marketId/teamA", Controllers.GetSpreadTeamA)
		grp1.GET("spread/:marketId/TeamB", Controllers.GetSpreadTeamB)
		grp1.GET("spread_odds/:marketId/teamA", Controllers.GetSpreadTeamAOdds)
		grp1.GET("spread_odds/:marketId/teamB", Controllers.GetSpreadTeamBOdds)
		grp1.GET("score/:marketId/teamA", Controllers.GetScoreTeamA)
		grp1.GET("score/:marketId/teamB", Controllers.GetScoreTeamB)
		grp1.GET("bets/:userAddr", Controllers.GetUserBetsHistory)
		grp1.GET("get_txns", Controllers.GetTransactions)
		grp1.GET("ws_txns", Controllers.WSTransactions)
		grp1.GET("pool/:interval", Controllers.GetPoolPerformance)
		grp1.GET("transactions", Controllers.GetTransactions)
		grp1.POST("send_txn", Controllers.SendTxn)
		grp1.POST("add_bet", Controllers.PostUserBetsHistory)
		grp1.POST("market/:marketId", Controllers.UpdateMarket)
		grp1.GET("commenced_markets", Controllers.GetCommencedMarkets)
	}
	grp2 := r.Group("/solbust")
	{
		grp2.POST("bet", Controllers.AddSolbustBet)
	}
	return r
}
