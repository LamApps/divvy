import { Table, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Transactions, TransactionsTable, numStringToNumberFormat } from '../../constants';
import { LIQUIDITY_ACTIVITY_COLUMNS, LIQUIDITY_ACTIVITY_MOBILE_COLUMNS } from '../../constants/LiquidityColumns';
import { DIVVY_WEBSOCKET_API } from "../../constants/urls";
import { shortenAddress } from "../../utils/utils";

const client = new W3CWebSocket(DIVVY_WEBSOCKET_API);

export const LiquidityActivityTable = (props: { transactions : Array<Transactions> | null | undefined }) => {
  const [data, setData] = useState<object[]>([])
  useEffect(() => {
    let tmpArr : TransactionsTable[] = [];
    if(props.transactions) {
      props.transactions.map(item => {
        tmpArr.push({
          key: item.id ? item.id : 0,
          type: item.type,
          pubkey: (item.pubkey && shortenAddress(item.pubkey?.toString(), 12)) + "",
          match: item.match,
          odds: item.odds_type+" <br />"+(item.odds && item.odds.includes('-') ? item.odds : item.odds == "0" ? item.odds_type != "-" ? "-" : "" : "+"+item.odds),
          amount: numStringToNumberFormat(item.amount.toString())
        })
      })
      tmpArr.reverse()
      setData(tmpArr);
    }
  }, [props.transactions])
  client.onopen = () => {
    console.log('WebSocket Client Connected');
  };
  client.onmessage = (message) => {
    console.log("Received transaction")
    let place = JSON.parse(message.data.toString())
    place['key'] = String(data.length);
    setData([place, ...data]);
  };
  client.onclose = (message) =>  {
    console.log("closed");
    console.log(message)
  }

  return (
    <Row>
      <Col span={0} md={0} lg={24}>
        <Table
          columns={LIQUIDITY_ACTIVITY_COLUMNS}
          dataSource={data}
          className={"pool-activity-table"}
        />
      </Col>
      <Col span={24} lg={0}>
        <Table
          columns={LIQUIDITY_ACTIVITY_MOBILE_COLUMNS}
          dataSource={data}
          className={"pool-activity-table"}
        />
      </Col>
    </Row>
  
  );
};