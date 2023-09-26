package main

import (
	"divvy-apis/Config"
	"divvy-apis/Models"
	"divvy-apis/Routes"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
)

var err error

func main() {
	Config.DB, err = gorm.Open("mysql", Config.DbURL(Config.BuildDBConfig()))
	Config.DB.LogMode(true)
	if err != nil {
		fmt.Println("Status:", err)
	}
	defer Config.DB.Close()
	Config.DB.AutoMigrate(&Models.Sports{})
	Config.DB.AutoMigrate(&Models.Seasons{})
	Config.DB.AutoMigrate(&Models.Markets{})
	Config.DB.AutoMigrate(&Models.Bets{})
	Config.DB.AutoMigrate(&Models.Pool{})
	Config.DB.AutoMigrate(&Models.Transactions{})
	Config.DB.AutoMigrate(&Models.SolbustBets{})
	r := Routes.SetupRouter()
	// only for testing
	r.Run(":80")
}
