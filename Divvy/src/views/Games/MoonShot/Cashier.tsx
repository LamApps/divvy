import {Button, Col, Divider, Form, Input, Row, Tabs} from "antd";
import { useContext, useEffect, useState } from "react";
import { useConnection, useConnectionConfig } from "../../../contexts/sol/connection";
import { useWallet } from "../../../contexts/sol/wallet";
import { useAccountByMint } from "../../../hooks";
import { BustBet } from "../../../models/games/moonshot/bets";
import { initBustBet } from "../../../models/sol/instruction/initBustBetInstruction";
import { useStoreBetsMutation } from "../../../store/games/moonshot/storeBet";
import { getUsdtMint } from "../../../utils/ids";
import { DeleteFilled } from "@ant-design/icons";
import { Auto } from "./Auto";
import { WalletSlider } from "../../../components/MyLiquidity/WalletSlider";
import LinkLabel from "../../../components/Nav/LinkLabel";
import { UserUSDCContext } from "../../../contexts/sol/userusdc";
import { notify } from "../../../utils/notifications";
import { LAMPORTS_PER_USDC, tokenAmountToString } from "../../../constants";
import { UserGameTokenContext } from "../../../contexts/sol/usergametoken";
import { MoonshotSocketContext } from "../../../contexts/moonshot-socket";
const { TabPane } = Tabs;

const Cashier = (props: {closeCashier: Function}) => {
    const wallet = useWallet();
    const connection = useConnection();
    const connectionConfig = useConnectionConfig();
    const usdcTokenAccount = useAccountByMint(getUsdtMint(connectionConfig.env))
    const { userUSDC } = useContext(UserUSDCContext)
    const { userGameToken } = useContext(UserGameTokenContext)
    const [usdcAmount, setUsdtAmount] = useState("");
    const socket = useContext(MoonshotSocketContext);

    useEffect(() => {
      if(userUSDC === 0) setUsdtAmount("")
    }, [userUSDC])
  
    const onWithdraw = async () => {
        if (wallet?.wallet?.publicKey == null) {
            notify({
                message: "Transaction failed...",
                description: "Please connect a wallet.",
                type: "error",
            });
            return;
        }
    
        const withdrawAmount = Number(usdcAmount);
        if (isNaN(withdrawAmount)) {
            notify({
                message: "Transaction failed...",
                description: "Invalid Token amount.",
                type: "error",
            });
            return;
        }
    
        console.log(`--> Withdraw: ${withdrawAmount}`);
        socket.emit('withdraw', withdrawAmount);
        props.closeCashier();
    };

    const onDeposit = async () => {
        if (wallet?.wallet?.publicKey == null) {
            notify({
                message: "Transaction failed...",
                description: "Please connect a wallet.",
                type: "error",
            });
            return;
        }
    
        const depositAmount = Number(usdcAmount);
        if (isNaN(depositAmount)) {
            notify({
                message: "Transaction failed...",
                description: "Invalid USDC amount.",
                type: "error",
            });
            return;
        }
    
    //   if (usdcTokenAccount == null) {
    //     notify({
    //       message: "Transaction failed...",
    //       description: "User does not have a USDC token account.",
    //       type: "error",
    //     });
    //     return;
    //   }
  
    //   const [, bumpSeed] = await PublicKey.findProgramAddress([Buffer.from("divvyhouse")], IDS.HOUSE_POOL_PROGRAM_ID);
  
    //   const [ix, signers] = await depositLiquidityTransaction(
    //     connection,
    //     wallet.wallet.publicKey,
    //     htTokenAccount?.pubkey,
    //     usdcTokenAccount.pubkey,
    //     IDS.getUsdtMint(connectionConfig.env),
    //     "deposit",
    //     depositAmount,
    //     bumpSeed);
  
    //   let metaData: Array<Transactions> = [{
    //     type: "Deposit",
    //     match: "-",
    //     odds: "-",
    //     odds_type: "-",
    //     amount: Number(usdcAmount)
    //   }];
    //   const [res_status, ] = await sendTransaction(
    //     connection,
    //     connectionConfig.env,
    //     wallet.wallet!,
    //     ix,
    //     metaData,
    //     signers,
    //   );
    //   if (res_status) setUsdtAmount('0')
        console.log(`--> Deposit: ${depositAmount}`);
        socket.emit('deposit', depositAmount);
        props.closeCashier();
    };
    return (
        <div style={{
            width: 500,
            background: 'var(--game-back-gray)',
            borderRadius: 10,
            padding: '1em',
        }}>
          <Row >
              <Col span={23}>
                <h2>Cashier</h2>
              </Col>
              <Col span={1} style={{cursor: 'pointer'}} onClick={() => props.closeCashier()}>X</Col>
          </Row>
          <Divider style={{margin:0}}/>
          <Tabs defaultActiveKey="1" className="game-moonshot__room__tabs">
            <TabPane tab="Deposit" key="1">
                <div style={{padding: '0 1em'}}>
                    <div className="balance-container">
                        <small className="text-secondary">Available to deposit:</small>
                        <label className="balance">{tokenAmountToString(userUSDC)} USDC</label>
                    </div>
                    {/* <Divider style={{margin: '0.5em'}} /> */}
                    <Form.Item name="usdcAmount" style={{margin:'1em 0'}}>
                        <Input.Group compact style={{display:'flex', alignItems:'center'}}>
                        <label
                            style={{
                            width: "35%"
                            }}>Amount to deposit: </label>
                        <Input placeholder={"USDC"} name="usdcAmount" value={usdcAmount} onChange={event => setUsdtAmount(event.currentTarget.value)} style={{width: "45%"}} />
                        <Button style={{border:"1px solid rgb(67, 67, 67)",  width:"20%", height: 32, padding:0}} onClick={e => setUsdtAmount((userUSDC / LAMPORTS_PER_USDC).toFixed(2).toString())} disabled={userUSDC === 0}>MAX</Button>
                        </Input.Group>
                    </Form.Item>
                    <WalletSlider         
                        onChange={(val: number) => setUsdtAmount((userUSDC / LAMPORTS_PER_USDC * val / 100).toFixed(2).toString()) }
                        value={usdcAmount === "" ? 0: Number(usdcAmount) * LAMPORTS_PER_USDC / userUSDC * 100}
                        disabled={userUSDC === 0}
                    />
                    <div style={{margin:'2em 0 1.5em'}}>
                        <Button
                            style={{
                                width:'100%',
                                padding:'1.5em',
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                borderRadius:'0.6em',
                                backgroundColor:'var(--game-blue)',
                                border:'none'
                            }}
                            disabled={usdcAmount === "" || Number(usdcAmount) == 0}
                            onClick={onDeposit}
                        >
                        Deposit
                        </Button>
                    </div>
                    <div style={{textAlign:'left', margin:'1em 0.5em'}}>
                        <span style={{color:'gray'}}>Balance: </span> {userGameToken.toFixed(2)}
                    </div>
                </div>
            </TabPane>
            <TabPane tab="Withdraw" key="2">
                <div style={{padding: '0 1em'}}>
                    <div className="balance-container">
                        <small className="text-secondary">Available to withdraw:</small>
                        <label className="balance">{userGameToken.toFixed(2)}</label>
                    </div>
                    {/* <Divider style={{margin: '0.5em'}} /> */}
                    <Form.Item name="usdcAmount" style={{margin:'1em 0'}}>
                        <Input.Group compact style={{display:'flex', alignItems:'center'}}>
                        <label
                            style={{
                            width: "35%"
                            }}>Amount to withdraw: </label>
                        <Input placeholder={"GameToken"} name="usdcAmount" value={usdcAmount} onChange={event => setUsdtAmount(parseFloat(event.currentTarget.value) > userGameToken ? userGameToken.toFixed(2) : event.currentTarget.value)} style={{width: "45%"}} />
                        <Button style={{border:"1px solid rgb(67, 67, 67)",  width:"20%", height: 32, padding:0}} onClick={e => setUsdtAmount(userGameToken.toFixed(2))} disabled={userGameToken === 0}>MAX</Button>
                        </Input.Group>
                    </Form.Item>
                    <WalletSlider         
                        onChange={(val: number) => setUsdtAmount((userGameToken * val / 100).toFixed(2)) }
                        value={usdcAmount === "" ? 0: Number(usdcAmount) / userGameToken * 100}
                        disabled={userGameToken === 0}
                    />
                    <div style={{margin:'2em 0 1.5em'}}>
                        <Button
                            style={{
                                width:'100%',
                                padding:'1.5em',
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                borderRadius:'0.6em',
                                backgroundColor:'var(--game-blue)',
                                border:'none'
                            }}
                            disabled={usdcAmount === "" || Number(usdcAmount) == 0}
                            onClick={onWithdraw}
                        >
                        Withdraw
                        </Button>
                    </div>
                    <div style={{textAlign:'left', margin:'1em 0.5em'}}>
                        <span style={{color:'gray'}}>Wallet: </span> {tokenAmountToString(userUSDC)} USDC
                    </div>
                </div>
            </TabPane>
          </Tabs>
  
        </div>
    )
}
export default Cashier;
