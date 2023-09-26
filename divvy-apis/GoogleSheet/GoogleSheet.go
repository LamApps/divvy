package GoogleSheet

import (
	"context"
	"divvy-apis/Models"
	"fmt"
	"google.golang.org/api/option"
	"google.golang.org/api/sheets/v4"
	"log"
	"path"
	"reflect"
	"runtime"
	"time"
)

var LAMPORTS_PER_USDC = uint64(1000000)

func getFieldString(Bet Models.Bets, field string) string {
	r := reflect.ValueOf(Bet)
	f := reflect.Indirect(r).FieldByName(field)
	return f.String()
}
func getFieldFloat(Bet Models.Bets, field string) float64 {
	r := reflect.ValueOf(Bet)
	f := reflect.Indirect(r).FieldByName(field)
	return f.Float()
}
func getFieldInt(Bet Models.Bets, field string) uint64 {
	r := reflect.ValueOf(Bet)
	f := reflect.Indirect(r).FieldByName(field)
	return f.Uint()
}

func AddTransactionToSheet(Bet Models.Bets) {
	ctx := context.Background()
	currentTime := time.Now()
	_, e, _, _ := runtime.Caller(0)
	d := path.Join(path.Dir(e))

	srv, err := sheets.NewService(ctx, option.WithCredentialsFile(d+"/credentials.json"))
	if err != nil {
		log.Fatalf("Unable to retrieve Sheets client: %v", err)
	}

	spreadsheetId := "16BNIkONLJ_VNVWKFx0-La_Q5z63OJjXmapSkyDO6sIo"
	readRange := "Sheet1!A2:Q"
	valueInputOption := "USER_ENTERED"
	insertDataOption := "INSERT_ROWS"
	values := [][]interface{}{[]interface{}{currentTime.Format("2006-01-02 15:04:05"), "Bet", "", getFieldString(Bet, "MarketName"), getFieldString(Bet, "SelectionTeam"), getFieldFloat(Bet, "Odds"), getFieldInt(Bet, "Risk") / LAMPORTS_PER_USDC, getFieldFloat(Bet, "Odds") * float64(getFieldInt(Bet, "Risk")/LAMPORTS_PER_USDC), getFieldFloat(Bet, "Odds")*float64(getFieldInt(Bet, "Risk")/LAMPORTS_PER_USDC) + float64(getFieldInt(Bet, "Risk")/LAMPORTS_PER_USDC), "", "", getFieldString(Bet, "LockedLiquidity"), getFieldString(Bet, "AvailableLiquidity"), getFieldString(Bet, "HtTokensBalance"), getFieldString(Bet, "HtPrice"), "", ""}}
	// resp, err := srv.Spreadsheets.Values.Get(spreadsheetId, readRange).Do()
	rb := &sheets.ValueRange{
		// TODO: Add desired fields of the request body.
		MajorDimension: "ROWS",
		Values:         values,
	}
	// new_row = [17]string{"9/1/21", "Bet",  "LAA", "VS", "TOR", "LAA", "115", "500", "575", "1075", "W", "1075", "575", "-575",  "0", "", ""}
	resp, err := srv.Spreadsheets.Values.Append(spreadsheetId, readRange, rb).ValueInputOption(valueInputOption).InsertDataOption(insertDataOption).Do()
	if err != nil {
		log.Fatalf("Unable to retrieve data from sheet: %v", err)
	}
	fmt.Println(resp)
}
