import {Col, Row} from "antd";
import { Tabs } from 'antd';
import { ConnectLink } from "../../../components/Nav/ConnectLink";
import { ReactComponent as Logo } from "../../../img/Divvy_UI_Logo_Beta.svg"
import { BETS_VIEW_PATH } from "../../../constants"
import { Link } from "react-router-dom";

import { ChatRoom } from "../../../components/Games/MoonShot/ChatRoom";
import { GameRoom } from "./GameRoom";
import { History } from "./History";
import { useWallet } from "../../../contexts/sol/wallet";
import { useContext, useEffect, useState } from "react";
import { MoonshotSocketContext } from "../../../contexts/moonshot-socket";
import Cashier from "./Cashier";

const { TabPane } = Tabs;
export const MoonShot = () => {
  const {connected, publicKey} = useWallet();
  const [hasPlayerRole, setHasPlayerRole] = useState<boolean>(false);
  const [newBet, setNewBet] = useState<any>(undefined);
  const [showCashier, setShowCashier] = useState<boolean>(false);
  const [val, setVal] = useState("0");
  const [busted, setBust] = useState<boolean>(false);
  const socket = useContext(MoonshotSocketContext);
  useEffect(() => {
    handleSocketLogin();
  }, [connected, publicKey]);
  useEffect(() => {
    handleSocketLogin();
  }, []);

  const handleSocketLogin = () => {
    if (connected) {
      setHasPlayerRole(true);
      console.log(`--> User login: ${publicKey?.toBase58()}`);
      socket.emit('logout');
      socket.emit('login', {
        address: publicKey?.toBase58()
      });
    } else {
      setHasPlayerRole(false);
      console.log(`--> Anonymous user`);
      socket.emit('logout');
    }
  };
 
  const handleBetHistory = (history: any) => {
    setNewBet(history);
  };

  return (
    <Row style={{minHeight:'800px', height:'100vh', backgroundColor:'var(--game-back-gray)', position:'relative'}}>
      <div style={{position:'absolute', top:0, left:0, zIndex:1}}>
        <Link to={BETS_VIEW_PATH}>
          <div className="sidebar-section" style={{display:"flex", alignContent:"center", padding:'0.5em 1em', outline:'none'}}>
            <Logo/>
          </div>
        </Link>
      </div>
      
      <div style={{position:'absolute', top:0, right:0, display:'flex', alignItems:'center', padding:'0.5em 1em', zIndex:1}}>
        <ConnectLink />
      </div>
        
      <Col md={24}>
        <Tabs defaultActiveKey="1" centered className="game-moonshot-tabs" style={{height:'100%'}}>
          <TabPane tab="Game" key="1" >
            <Row style={{height:'100%'}} > 
              <Col span={24} md={7} style={{minHeight:'800px', backgroundColor:'var(--game-back-gray)'}}>
                <ChatRoom hasRole={hasPlayerRole} />
              </Col>
              <Col span={24} md={17}>
                <Row gutter={16} style={{height:'100%', rowGap:'1em', backgroundColor:'var(--off-black)', padding:'2em', borderRadius:'2em 0 0 0'}}>
                  <Col span={24} md={11}>
                    <GameRoom val={val} setVal={(value: string) => setVal(value)} hasRole={hasPlayerRole} updateBetHistory={handleBetHistory} setBusted={(state: boolean) => setBust(state)} />
                  </Col>
                  <Col span={24} md={13}>
                    <History val={val} newHistory={newBet} openCashier={() => setShowCashier(connected)} isBusted={busted} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Leaderboard" disabled key="2">
          </TabPane>
          <TabPane tab="Help" disabled key="3">
          </TabPane>
        </Tabs>
      </Col>
      
      { showCashier &&
        <div style={{position:'fixed', width: '100vw', height: '100vh', background: 'rgb(0, 0, 0, 0.5)', display:'flex', alignItems:'center', justifyContent: 'center', zIndex:10}}>
          <Cashier closeCashier={() => setShowCashier(false)} />
        </div>
      }
    </Row>
  )
}
