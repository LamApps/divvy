package Models

type MarketStatus uint

const (
    TEAM_A_WON MarketStatus = 0
    TEAM_B_WON MarketStatus = 1
    DRAW MarketStatus = 2
    NOT_COMMENCED MarketStatus = 3
    COMMENCED MarketStatus= 4
    MARKET_SETTLED MarketStatus = 5
)
