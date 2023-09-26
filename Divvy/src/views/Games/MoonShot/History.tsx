import React, { useContext, useEffect, useState } from "react";
import {Col, Row} from "antd";
import { Tabs, Input, Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { MoonshotSocketContext } from "../../../contexts/moonshot-socket";
const { TabPane } = Tabs;

const TestPlayers = new Array(50).fill({
  name: 'creators_main',
  value: '2.64',
  bet: '2,000',
  profit: '450.00'
})
const TestHistory = new Array(30).fill({
  bust: (Math.random() * 10).toFixed(2),
  value: 2.64,
  bet: '2,000',
  profit: '-',
  hash: 'f84dce90b539befrg...'
})

export const History = (props: {val: string, newHistory: any, isBusted: boolean, openCashier: Function}) => {
  const [userBetHistory, setUserBetHistory] = useState<any[]>([]);
  const [playerBetList, setPlayerBetList] = useState<any[]>([]);
  const [_, forceUpdate] = useState(0);
  const socket = useContext(MoonshotSocketContext);

  useEffect(() => {
    if (!props.newHistory) return;
    let newUserHistory = Object.assign(userBetHistory);
    if (newUserHistory.length == 20) newUserHistory.pop();
    newUserHistory.splice(0, 0, props.newHistory);
    console.log(newUserHistory);
    setUserBetHistory(newUserHistory);
    forceUpdate(Math.random());
  }, [props.newHistory])

  useEffect(() => {
    let newPlayerBets = Object.assign(playerBetList);
    for (const index in newPlayerBets) {
      if (newPlayerBets[index].status == 'init' && parseFloat(newPlayerBets[index].value) <= parseFloat(props.val)) newPlayerBets[index].status = 'profit';
    }
    setPlayerBetList(newPlayerBets);
    forceUpdate(Math.random());
  }, [props.val]);
  
  useEffect(() => {
    let timeout = undefined as any;
    if (props.isBusted) {
      let newPlayerBets = Object.assign(playerBetList);
      for (const index in newPlayerBets) {
        if (newPlayerBets[index].status == 'init' && props.isBusted) newPlayerBets[index].status = 'lost';
      }
      setPlayerBetList(newPlayerBets);
      forceUpdate(Math.random());
      const clearList = () => {
        setPlayerBetList([]);
      }
      timeout = setTimeout(clearList, 200);
    }
    socket.on('newBet', attachSocketEvent);
    return () => {
      socket.off('newBet', attachSocketEvent);
    };
  }, [socket, props.isBusted])

  const attachSocketEvent = (data: any) => {
    if (!data) return;
    setPlayerBetList((oldList: any) => [
      ...oldList,
      {
        name: data.address,
        value: data.payout,
        bet: data.bet,
        status: 'init',
        profit: (parseFloat(data.payout) * parseFloat(data.bet)).toFixed(2),
      }
    ]);
    forceUpdate(Math.random());
  }

  return (
    <div style={{display:'flex', flexDirection:'column'}}>
      <Row gutter={20} style={{height:'100%'}}>
        <Col span={8}>
          <div className="game-moonshot__history__option">
            <label style={{margin:'1em', fontSize:'1.2em'}}>Bankroll</label>
            <img src="../moonshot_bankroll_back.svg" style={{height:'100%'}} alt="bankroll" />
          </div>
        </Col>
        <Col span={8}>
          <div className="game-moonshot__history__option" style={{cursor: "pointer"}} onClick={() => props.openCashier()}>
            <label style={{margin:'1em', fontSize:'1.2em', cursor: "pointer"}}>Cashier</label>
            <img src="../moonshot_bankroll_back.svg" style={{height:'100%', cursor: "pointer"}} alt="bankroll" />
          </div>
        </Col>
        <Col span={8}>
          <div className="game-moonshot__history__option">
            <label style={{margin:'1em', fontSize:'1.2em'}}>Stats</label>
            <img src="../moonshot_bankroll_back.svg" style={{height:'100%'}} alt="bankroll" />
          </div>
        </Col>
      </Row>
      <div style={{borderRadius:'1em', marginTop:'1em', height:'770px', overflow:'scroll', backgroundColor:'var(--game-back-gray)'}}>
        <Tabs defaultActiveKey="1" className="game-moonshot__room__tabs" style={{maxHeight:'100%'}}>
          <TabPane tab="Player" key="1" style={{overflowY:'scroll'}}>
            <Row style={{padding:'0.5em 1.5em', borderBottom:'1px solid #303030'}}>
              <Col span={11} style={{marginRight: '0.5em'}}>User</Col>
              <Col span={4}>@</Col>
              <Col span={4}>Bet</Col>
              <Col span={4}>Profit</Col>
            </Row>
            {
              playerBetList.map((player, index) => 
                <Row key={index} style={{padding:'0.5em 1.5em'}}>
                  <Col span={11} style={{color:'var(--game-blue)', overflow: 'hidden', marginRight: '0.5em'}}>{player.name}</Col>
                  <Col span={4}>{player.value}&times;</Col>
                  <Col span={4}>{player.bet}</Col>
                  <Col span={4} style={{color: player.status == 'profit' ? 'green' : player.status == 'lost' ? 'red' : 'white'}}>
                    {player.status=='init' ? '-' : parseFloat(player.profit).toFixed(2)}
                    {player.status == 'profit' ? <ArrowUpOutlined /> : player.status == 'lost' ? <ArrowDownOutlined /> : <></>}
                  </Col>
                </Row>                  
              )
            }
            
          </TabPane>
          <TabPane tab="History" key="2" style={{overflowY:'scroll'}}>
            <Row style={{padding:'0.5em 1.5em', borderBottom:'1px solid #303030'}}>
              <Col span={4}>Bust</Col>
              <Col span={4}>@</Col>
              <Col span={4}>Bet</Col>
              <Col span={4}>Profit</Col>
              <Col span={7}>Hash</Col>
            </Row>
            {
              userBetHistory.map((history, index) => 
                <Row key={index} style={{padding:'0.5em 1.5em', overflowX: 'hidden'}}>
                  <Col span={4} style={{color: history.payout != '-' && parseFloat(history.payout) > parseFloat(history.bust) ? 'red' : 'green'}}>{history.bust}&times;</Col>
                  <Col span={4}>{`${history.payout}${history.payout=='-' ? '' : 'x'}`}</Col>
                  <Col span={4}>{history.bet}</Col>
                  <Col span={4}>{history.profit == '-' || parseFloat(history.payout) > parseFloat(history.bust) ? '-' : parseFloat(history.profit).toFixed(2)}</Col>
                  <Col span={7}><a target='_blank' href={`https://solscan.io/account/${history.hash}?cluster=devnet`}>{history.hash}</a></Col>
                </Row>
              )
            }
          </TabPane>
        </Tabs>
      </div>

    </div>
  )
}