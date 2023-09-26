import React, {useContext, useEffect, useState} from 'react';
import { Col, Divider, Row } from 'antd';
import { CaretRightFilled } from '@ant-design/icons';
import { Tabs, Input, Button } from 'antd';
import { DeleteFilled } from "@ant-design/icons";
import { Auto } from './Auto';
import {MultiplierRocket} from "../../../components/Games/MoonShot/MultiplierRocket";
import { RocketAnimation } from '../../../components/Games/MoonShot/RocketAnimation';
import { UserGameTokenContext } from '../../../contexts/sol/usergametoken';
import { MoonshotSocketContext } from '../../../contexts/moonshot-socket';
import { useWallet } from '../../../contexts/sol/wallet';

const { TabPane } = Tabs;

export const GameRoom = (props: {val: string, setVal: Function, hasRole: boolean, updateBetHistory: Function, setBusted: Function}) => {
  const {connected} = useWallet();
  const [bet, setBet] = useState('0')
  const [payout, setPayout] = useState('0')
  const [currency, setCurrency] = useState('dolar')
  const [roundHistory, setRoundHistory] = useState<any[]>([]);
  const [_, forceUpdate] = useState(0);
  const { userGameToken } = useContext(UserGameTokenContext);
  const [betDisabled, disableBet] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [isPlayer, setIsPlayer] = useState<boolean>(false);
  const socket = useContext(MoonshotSocketContext);
  
  useEffect(() => {
    if (!props.hasRole) {
      disableBet(true);
      return;
    }
    if (bet == '' || parseFloat(bet) == 0) {
      disableBet(true);
      return;
    }
    if (payout == '' || parseFloat(payout) == 0) {
      disableBet(true);
      return;
    }
    if (parseFloat(bet) > userGameToken) {
      disableBet(true);
      return;
    }
    if (!isProcessing) disableBet(false);
    else disableBet(true);
  }, [props.hasRole, bet, payout, userGameToken, isProcessing]);

  useEffect(() => {
    setIsProcessing(true);
    disableBet(true);
  }, []);

  const onBetChange = (e: any) => {
    let value = e.currentTarget.value;
    let amount = parseFloat(value);
    if (isNaN(amount) || amount < 0) amount = -1;
    if (amount > userGameToken) amount = userGameToken;
    if (value.length > 0 && value.indexOf('.') == value.length - 1) setBet(amount.toString() + '.');
    else if (value.length > 0 && value[value.length - 1] == '0' && amount != -1) setBet(value);
    else setBet(amount > 0 ? amount.toString() : '0');
  }
  const onPayoutChange = (e: any) => {
    let value = e.currentTarget.value;
    let amount = parseFloat(value);
    if (isNaN(amount) || amount < 0) amount = -1;
    if (value.length > 0 && value.indexOf('.') == value.length - 1) setPayout(amount.toString() + '.');
    else if (value.length > 0 && value[value.length - 1] == '0' && amount != -1) setPayout(value);
    else setPayout(amount > 0 ? amount.toString() : '0');
  }
  const handleBust = (val: number, hash: string) => {
    console.log(`--> Bust: ${val}`);
    console.log(`--> Hash: ${hash}`);
    let newHistory = Object.assign(roundHistory);
    if (roundHistory.length == 8) newHistory.pop();
    // Place random bet for test
    newHistory.splice(0, 0, {
      bust: val,
      payout: isPlayer ? payout : 0,
      hash,
    })
    props.updateBetHistory({
      bust: val,
      payout: isPlayer ? payout : '-',
      bet: isPlayer ? bet : '-',
      profit: isPlayer ? parseFloat(payout) * parseFloat(bet) : '-',
      hash,
    });
    setRoundHistory(newHistory);
    setIsPlayer(false);
    props.setBusted(true);
    props.setBusted(false);
    forceUpdate(Math.random());
  }
  const handleBet = () => {
    if (!connected || isProcessing) return;
    if (parseFloat(bet) > userGameToken) return;
    console.log(`--> AddBet: `, bet, payout);
    socket.emit('addBet', {bet, payout});
    setIsProcessing(true);
    disableBet(true);
    setIsPlayer(true);
  }
  return (
    <div style={{backgroundColor:'var(--game-back-gray)', borderRadius:'1em', height:'100%', textAlign:'center'}}>
       <MultiplierRocket val={props.val} setVal={props.setVal} onBust={handleBust} onBusting={setIsProcessing} />
      <Row style={{color:'#1dc742', padding:'0.5em 1.5em'}}>
      {
        roundHistory.length > 0 ? roundHistory.map((round, index) => 
          <Col key={index} span={3} style={{color: parseFloat(round.payout) > parseFloat(round.bust) ? 'red' : 'green', opacity: index == 7 ? 0.5 : 1}}>{round.bust}&times;</Col>
        )
        : <Col span={3}>&nbsp;</Col>
      }
      </Row>
      <Divider style={{margin:0}}/>
      <div style={{}}>
        <Tabs defaultActiveKey="1" className="game-moonshot__room__tabs">
          <TabPane tab="Manual" key="1" style={{padding:'1em'}}>
            <div style={{display:'flex', margin:'1em 0', flexDirection:'column'}}>
              <label style={{margin:'0.5em', textAlign:'left'}}>Bet</label>
              <div style={{height:'3em', backgroundColor:'var(--off-black)', display:'flex', alignItems:'center', borderRadius:'0.6em', overflow:'hidden'}}>
                <Input className="game-moonshot__input" value={bet} onChange={onBetChange} disabled={!props.hasRole} />
                <div style={{cursor:'pointer', height:'100%', display:'flex', alignItems:'center'}}>
                { currency === 'dolar' &&
                  <>
                    <span style={{padding:'0.5em 1em', backgroundColor:'var(--game-blue)'}} onClick={()=>{setCurrency('dolar')}}>$</span>
                    <span style={{padding:'0.5em 1em'}} onClick={()=>{setCurrency('usdc')}}>USDC</span>
                  </>
                }
                { currency === 'usdc' &&
                  <>
                    <span style={{padding:'0.5em 1em',}} onClick={()=>{setCurrency('dolar')}}>$</span>
                    <span style={{padding:'0.5em 1em', backgroundColor:'var(--game-blue)'}} onClick={()=>{setCurrency('usdc')}}>USDC</span>
                  </>
                }
                </div>
              </div>
            </div>
            <div style={{display:'flex', margin:'1em 0', flexDirection:'column'}}>
              <label style={{margin:'0.5em', textAlign:'left'}}>Payout</label>
              <div style={{height:'3em', backgroundColor:'var(--off-black)', display:'flex', alignItems:'center', borderRadius:'0.6em'}}>
                <Input className="game-moonshot__input" value={payout} onChange={onPayoutChange} disabled={!props.hasRole} />
                <DeleteFilled style={{padding:'0.8em', height:'100%', display:'flex', alignItems:'center', fontSize:'1.2em',color:'gray', borderLeft:'1px solid #303030'}}/>
              </div>
            </div>
            <div style={{margin:'1.5em 0'}}>
              <Button style={{width:'100%', padding:'1.5em', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'0.6em', backgroundColor:'var(--game-blue)', border:'none'}} disabled={betDisabled} onClick={handleBet}>
                Bet
              </Button>
            </div>
            <div style={{textAlign:'left', margin:'1em 0.5em'}}>
              <span style={{color:'gray'}}>Target profit: </span> {(parseFloat(bet) * parseFloat(payout)).toFixed(2)}
            </div>
          </TabPane>
          <TabPane tab="Auto" key="2">
            <Auto hasRole={betDisabled} />
          </TabPane>
        </Tabs>

      </div>

    </div>

  )
}
