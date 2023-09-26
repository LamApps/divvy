import { PublicKey } from "@solana/web3.js";
import { Form, Input, Button, Tooltip, Divider } from "antd";
import {
  useConnection,
  useConnectionConfig,
  sendTransaction,
} from "../../contexts/sol/connection";
import { useWallet } from "../../contexts/sol/wallet";
import { useAccountByMint } from "../../hooks";
import { notify } from "../../utils/notifications";
import { LABELS } from "../../constants/labels"
import { ExplorerLink } from "../ExplorerLink";
import { Market } from "../../constants";
import { InfoCircleOutlined } from "@ant-design/icons";
import { WalletSlider } from "../MyLiquidity/WalletSlider";
import { depositLiquidityTransaction } from "../../models/sol/instruction/depositLiquidityInstruction";
import { useContext, useState, useEffect } from "react";
import { UserUSDCContext } from "../../contexts/sol/userusdc";
import { LAMPORTS_PER_HP as LAMPORTS_PER_HT, LAMPORTS_PER_USDC, tokenAmountToString, Transactions } from "../../constants";
import { CommonHeader } from "../Common/CommonHeader";
import { UserHTContext } from "../../contexts/sol/userht";
import { HousePoolContext } from "../../contexts/sol/hpliquidity";
import { BetStateContext } from "../../contexts/sol/betstate";
import { HPTokenContext } from "../../contexts/sol/hptoken";
import LinkLabel from "../Nav/LinkLabel";
import * as IDS from "../../utils/ids"
import { useMediaQuery } from "../../utils/utils";

export const LiquidityProviderWithdrawal = (props: { isLoading: boolean, data: Array<Market> | undefined }) => {
  const wallet = useWallet();
  const connection = useConnection();
  const connectionConfig = useConnectionConfig();
  const htTokenAccount = useAccountByMint(IDS.HT_MINT)
  const usdcTokenAccount = useAccountByMint(IDS.getUsdtMint(connectionConfig.env))
  const { userUSDC } = useContext(UserUSDCContext)
  const { userHT } = useContext(UserHTContext);
  const [usdcAmount, setUsdtAmount] = useState("");
  const [htAmount, setHtAmount] = useState("");
  const { htBalance } = useContext(HousePoolContext);
  const { lockedLiquidity } = useContext(BetStateContext);
  const { htSupply } = useContext(HPTokenContext);
  let isMobile = useMediaQuery('(max-width: 400px)');

  useEffect(() => {
    if(userUSDC === 0) setUsdtAmount("")
  }, [userUSDC])

  const onWithdraw = async (values: any) => {
    if (wallet.wallet?.publicKey == null) {
      notify({
        message: "Transaction failed...",
        description: "Please connect a wallet.",
        type: "error",
      });
      return;
    }

    let htLamports = Number(htAmount) * LAMPORTS_PER_HT;
    if (isNaN(htLamports)) {
      notify({
        message: "Transaction failed...",
        description: "Invalid HT amount.",
        type: "error",
      });
      return;
    }

    if (htTokenAccount == null) {
      notify({
        message: "Transaction failed...",
        description: "User does not have a HP token account.",
        type: "error",
      });
      return;
    }

    const [, bumpSeed] = await PublicKey.findProgramAddress([Buffer.from("divvyhouse")], IDS.HOUSE_POOL_PROGRAM_ID);

    const res = await depositLiquidityTransaction(
      connection,
      wallet.wallet.publicKey,
      htTokenAccount.pubkey,
      usdcTokenAccount?.pubkey,
      IDS.getUsdtMint(connectionConfig.env),
      "withdraw",
      htLamports * htSupply / (htBalance + lockedLiquidity),
      bumpSeed);
    const [ix, signers] = res
    let metaData: Array<Transactions> = [{
      type: "Withdraw",
      match: "-",
      odds: "-",
      odds_type: "-",
      amount: Number(htAmount)
    }];
    const [res_status, ] = await sendTransaction(
      connection,
      connectionConfig.env,
      wallet.wallet,
      ix,
      metaData,
      signers
    );
    if (res_status) setHtAmount('0')
  };
  return (
    <div>
      <CommonHeader side={true} heading={"House withdrawal & rewards"} />
      <Divider />
      <div className="balance-container">
        <small className="text-secondary">Withdrawable balance:</small>
        <label className="balance">{tokenAmountToString((htBalance + lockedLiquidity) / htSupply * userHT)} USDC({tokenAmountToString(userHT)} HT)</label>
      </div>
      <Divider />
      <Form.Item
        name="usdcAmount"
        rules={[{ required: true, message: "Please input the USDC amount." }]}>
        <Input.Group compact style={{display:'flex', alignItems:'center'}}>
          <label
            style={isMobile ? {
              width: '100%',
              position: 'absolute',
              top: 7,
              left: 10,
              fontSize: 10,
              color: '#6a6a6a'
            } : {
              width: "30%"
            }}>Amount to withdraw: </label>
          <Input placeholder={"USDC"} value={htAmount} onChange={event => setHtAmount(event.currentTarget.value)} style={isMobile ? {width: '80%', height: 50, paddingTop: 20} : { width: "50%" }} />
          <Button style={{border: "1px solid rgb(67, 67, 67)", width: "20%", height: isMobile ? 50 : 32, padding:0}} onClick={e => setHtAmount(((htBalance + lockedLiquidity) / htSupply * userHT / LAMPORTS_PER_HT).toFixed(2).toString())} disabled={userHT === 0}>MAX</Button>
        </Input.Group>
      </Form.Item>
      <WalletSlider 
        onChange={(val: number) => setHtAmount(((htBalance + lockedLiquidity) / htSupply * userHT / LAMPORTS_PER_HT * val / 100).toFixed(2).toString()) }
        value={htAmount === "" ? 0: Number(htAmount) * LAMPORTS_PER_HT / ( (htBalance + lockedLiquidity) / htSupply * userHT ) * 100}
        disabled={userHT === 0}
      />

      <div style={{display:'flex', justifyContent:'space-between', marginTop:'2.5em', flexDirection: isMobile ? 'column' : 'row'}}>
        <Button style={{width: isMobile ? '100%' : '48%', padding: '0.6em', height:'auto'}}>
          <LinkLabel style={{margin: "auto"}}>
            <span style={{overflow: 'hidden'}}>Approve</span>
          </LinkLabel>
        </Button>
        <Button onClick={onWithdraw} disabled={Number(htAmount) === 0} style={{width: isMobile ? '100%' : '48%', marginTop: isMobile ? '1em' : 0, padding: '0.6em', height:'auto'}}>
          <LinkLabel style={{ margin:"auto" }}>
            <span>Withdraw</span>
          </LinkLabel>
        </Button>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', marginTop:'1em', flexDirection: isMobile ? 'column' : 'row'}}>
        <Button style={{width: isMobile ? '100%' : '48%', padding: '0.6em', height:'auto'}}>
          <LinkLabel style={{ margin:"auto" }}>
            <span>Claim Rewards</span>
          </LinkLabel>
        </Button>
        <Button style={{width: isMobile ? '100%' : '48%', marginTop: isMobile ? '1em' : 0, padding: '0.6em', height:'auto'}}>
          <LinkLabel style={{ margin:"auto" }}>
            <span>Withdraws and Claim</span>
          </LinkLabel>
        </Button>
      </div>
      
      <Divider />
      <div className="balance-container">
        <small className="text-secondary">House Tokens currently staked:</small>
        <label className="balance">HT</label>
      </div>

      <Divider />      
      <Form.Item name="usdcAmount" style={{marginBottom:'1em'}}>
        <Input.Group compact style={{display:'flex', alignItems:'center'}}>
          <label
            style={isMobile ? {
              width: '100%',
              position: 'absolute',
              top: 7,
              left: 10,
              fontSize: 10,
              color: '#6a6a6a'
            } : {
              width: "30%"
            }}>Amount to unstake: </label>
          <Input placeholder={"USDC"} name="usdcAmount" style={isMobile ? {width: '80%', height: 50, paddingTop: 20} : { width: "50%" }} />
          <Button style={{border:"1px solid rgb(67, 67, 67)",  width:"20%", height: isMobile ? 50 : 32, padding:0}}>MAX</Button>
        </Input.Group>
      </Form.Item>
      <WalletSlider         
        onChange={()=>{}}
        value={0}
        disabled={userUSDC === 0}
      />
    </div>
  );
};
