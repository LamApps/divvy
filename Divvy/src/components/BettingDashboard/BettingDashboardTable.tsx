import { useState, useEffect } from 'react';
import { Table} from 'antd';
import { DATE_STRING_TO_NUMBER } from "../../constants/DashboardColumns";
import { BetStatus, BetsTable } from "../../constants/bets";
import { useGetBetsQuery } from "../../store/getBets";
import { useWallet } from "../../contexts/sol/wallet";
import { americanToDecimal, LAMPORTS_PER_USDC, numStringToNumberFormat } from "../../constants/math";

export const BettingDashboardTable = (props: { sortBy: string, sortedInfo: any, filteredInfo: any, setSortedInfo: any, setFilteredInfo: any }) => {
    const wallet = useWallet();  
    const { data, error, isLoading, refetch } = useGetBetsQuery(wallet?.publicKey?.toString());
    const [betData, setBetData] = useState<BetsTable[]>([]);

    useEffect(() => {
      refetch()
    }, [])

    useEffect(() => {
      let tmpArr: BetsTable[] = [];
      data?.map((bet: any, i: number) => {
        let odds = (bet["odds"] < 0 ? "" : "+")+bet["odds"];;
        if(bet["betType"] === "Points Spread") {
          odds += "<br />"+(bet["marketName"].split(" vs ")[0] === bet["selectionTeam"] ? (bet["teamASpreadPoints"] >= 0 ? "+" : "-" )+bet["teamASpreadPoints"] : (bet["teamBSpreadPoints"] >= 0 ? "+" : "-" )+bet["teamBSpreadPoints"]);
        } else if(bet["betType"] === "Total Score") {
          odds += "<br />"+(bet["marketName"].split(" vs ")[0] === bet["selectionTeam"] ? (bet["teamATotalPoints"] >= 0 ? "O " : "U " )+bet["teamATotalPoints"] : (bet["teamBTotalPoints"] >= 0 ? "O " : "U " )+bet["teamBTotalPoints"]);
        }
        // console.log('---------', bet)
        const betStatus = bet["status"] !== 2 ? BetStatus[bet["status"]]: bet["payout"] > 0 ? 'Win': 'Loss'
        tmpArr.push({
          key: i,
          type: 'Single',
          match: bet["marketName"],
          sport: bet["sportName"],
          placed: bet["placedOn"].split(" "),
          settled: betStatus,
          bettype: bet["betType"],
          odds: odds, 
          wager: '<b>'+bet["risk"]/LAMPORTS_PER_USDC+' USDC</b>',
          potential: bet["payout"]+' USDC',
          time: bet["placedOn"].split(" ")
        })
      })
      setBetData(tmpArr);
    }, [data])
    const handleChange = (pagination: any, filters: any, sorter: any) => {
        props.setSortedInfo(sorter);
        props.setFilteredInfo(filters);
    }
    const convertToDate = (date : String[]) : any => {
        let parsedDate =  Date.parse(date.slice(0, 5).join())
        // console.log(parsedDate)
        return parsedDate;
    }

    const DASHBOARD_COLUMNS = [
        {
          title: 'BET TYPE',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: 'MATCH',
          dataIndex: 'match',
          key: 'match',
          render: (html : any) => <div className="text-table" dangerouslySetInnerHTML={{__html: html}} />
        },
        {
          title: "SPORT",
          dataIndex: "sport",
          key: 'sport',
          filters: [
              { text: 'All Bets', value: '' },
              { text: 'Football', value: 'Football' },
              { text: 'Baseball', value: 'Baseball' }
          ],
          filteredValue: props.filteredInfo.sport || null,
          onFilter: (value : any, record : any) => record.sport.includes(value),
        },
        {
          title: 'PLACED ON',
          dataIndex: 'placed',
          key: 'placed',
          render: (date : String[]) => <div className="text-table" style={{ textAlign: "right" }}>{date[1]} {date[2]} <br />at {date[4].split(":")[0]+":"+date[4].split(":")[1] + (parseFloat(date[4].split(":")[0]) >= 12 ? " PM" : " AM")}</div>,
          sorter: {
            compare: (a: any, b: any) => convertToDate(a.placed)-convertToDate(b.placed)
          },
          sortOrder: props.sortedInfo.columnKey === 'placed' && props.sortedInfo.order,
        },
        {
          title: 'SETTLED ON',
          dataIndex: 'settled',
          key: 'settled',
          render: (html : any) => <div className="text-table" style={{ textAlign: "right" }} dangerouslySetInnerHTML={{__html: html}} />
        },
        {
          title: "ODDS",
          dataIndex: "odds",
          key: "odds",
          render: (html : any) => <div className="text-table" style={{ textAlign: "right" }} dangerouslySetInnerHTML={{__html: html}} />
        },
        {
          title: "SPREAD",
          dataIndex: "bettype",
          key: "bettype",
        },
        {
          title: "Risk",
          dataIndex: "wager",
          key: "wager",
          render: (html : any) => <div className="text-table" style={{ textAlign: "right" }} dangerouslySetInnerHTML={{__html: html}} />
        },
        {
          title: "TO WIN",
          dataIndex: "potential",
          key: "potential",
          sorter: {
              compare: (a: any, b: any) => JSON.parse(a.potential.split(' USDC')[0].replace(',', ''))-JSON.parse(b.potential.split(' USDC')[0].replace(',', ''))
          },
          sortOrder: props.sortedInfo.columnKey === 'potential' && props.sortedInfo.order,
        },
        {
          title: 'EVENT TIME',
          dataIndex: 'time',
          key: 'time',
          render: (date : String[]) => <div className="text-table" style={{ textAlign: "right" }}>{date[1]} {date[2]} <br />at {date[4].split(":")[0]+":"+date[4].split(":")[1] + (parseFloat(date[4].split(":")[0]) >= 12 ? " PM" : " AM")}</div>,
          sorter: {
            compare: (a: any, b: any) => convertToDate(a.placed)-convertToDate(b.placed)
          },
          sortOrder: props.sortedInfo.columnKey === 'time' && props.sortedInfo.order,
        },
    ];

    return (
        <Table 
            columns={DASHBOARD_COLUMNS} 
            dataSource={betData} 
            className={"pool-activity-table"} 
            onChange={handleChange}
        />
    );
};