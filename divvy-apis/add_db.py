import mysql.connector
import urllib.request
import json
import time
import os
from dotenv import load_dotenv
load_dotenv(".env")
cnx = mysql.connector.connect(user=os.getenv('DB_USER'), pasFeedPubkeyord=os.getenv('DB_PWD'),
                              host=os.getenv('DB_HOST'), database=os.getenv('DB_NAME'))
mycursor = cnx.cursor()
url = urllib.request.urlopen("https://api.the-odds-api.com/v3/odds/?apiKey=1c1cef445a730e7dd8d5f98395977688&sport=soccer_uefa_european_championship&region=us&market=spreads")
data = json.loads(url.read().decode())
for market in data['data']:
    odds_api_id = market['id']
    # teamA = market['teams'][0]
    # teamB = market['teams'][1]
    # home_team = "teamA" if market['teams'].index(market['home_team']) == 0 else "teamB"
    # sport_id = 1
    # end_time = market['commence_time']
    # last_updated = time.time()
    # seasonId = 1
    # winner = 0
    # active = 1
    # oddsA = []
    # oddsB = []
    # oddsDraw = []
    # for i in market['sites']:
    #     oddsA.append(i['odds']['h2h'][0])
    #     oddsB.append(i['odds']['h2h'][1])
    #     oddsDraw.append(i['odds']['h2h'][2])
    # teamA_odds_moneyline = round(sum(oddsA)/len(oddsA), 2)
    # teamB_odds_moneyline = round(sum(oddsB)/len(oddsA), 2)
    # drawodds_moneyline = round(sum(oddsDraw)/len(oddsA), 2)
    # ou_score = market['sites'][0]['odds']['totals']['points'][0]
    teamA_spread_total = market['sites'][0]['odds']['spreads']['points'][0]
    teamB_spread_total = market['sites'][0]['odds']['spreads']['points'][1]
    # over_odds = market['sites'][0]['odds']['totals']['odds'][0]
    # under_odds = market['sites'][0]['odds']['totals']['odds'][1]
    teamA_odds_spreads = market['sites'][0]['odds']['spreads']['odds'][0]
    teamB_odds_spreads = market['sites'][0]['odds']['spreads']['odds'][1]
    # query = "INSERT INTO markets (odds_api_id, teamA, teamB, home_team, sport_id, end_time, last_updated, seasonId, winner, active, teamA_odds_moneyline, teamB_odds_moneyline, draw_odds_moneyline) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
    # query = "UPDATE markets SET ou_score = %s, over_odds = %s, under_odds = %s WHERE odds_api_id = %s"
    query = "UPDATE markets SET teamA_spread_total = %s, teamB_spread_total = %s, teamA_odds_spreads = %s, teamB_odds_spreads=%s WHERE odds_api_id = %s"
    # values = (odds_api_id, teamA, teamB, home_team, sport_id, end_time, last_updated, seasonId, winner, active, teamA_odds_moneyline, teamB_odds_moneyline, drawodds_moneyline, )
    # values = (ou_score, over_odds, under_odds, odds_api_id, )
    values = (teamA_spread_total, teamB_spread_total, teamA_odds_spreads, teamB_odds_spreads, odds_api_id)
    mycursor.execute(query, values)
    cnx.commit()
