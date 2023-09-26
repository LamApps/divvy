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

export const LiquidityProviderDeposit = (props: { isLoading: boolean, data: Array<Market> | undefined }) => {
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
  const { lockedLiquidity } = useContext(BetStateContext)
  const { htSupply } = useContext(HPTokenContext);
  let isMobile = useMediaQuery('(max-width: 400px)');

  useEffect(() => {
    if(userUSDC === 0) setUsdtAmount("")
  }, [userUSDC])

  const onDeposit = async () => {
    if (wallet?.wallet?.publicKey == null) {
      notify({
        message: "Transaction failed...",
        description: "Please connect a wallet.",
        type: "error",
      });
      return;
    }

    const usdcLamports = Number(usdcAmount) * LAMPORTS_PER_USDC;
    if (isNaN(usdcLamports)) {
      notify({
        message: "Transaction failed...",
        description: "Invalid USDC amount.",
        type: "error",
      });
      return;
    }

    if (usdcTokenAccount == null) {
      notify({
        message: "Transaction failed...",
        description: "User does not have a USDC token account.",
        type: "error",
      });
      return;
    }

    const [, bumpSeed] = await PublicKey.findProgramAddress([Buffer.from("divvyhouse")], IDS.HOUSE_POOL_PROGRAM_ID);

    const [ix, signers] = await depositLiquidityTransaction(
      connection,
      wallet.wallet.publicKey,
      htTokenAccount?.pubkey,
      usdcTokenAccount.pubkey,
      IDS.getUsdtMint(connectionConfig.env),
      "deposit",
      usdcLamports,
      bumpSeed);

    let metaData: Array<Transactions> = [{
      type: "Deposit",
      match: "-",
      odds: "-",
      odds_type: "-",
      amount: Number(usdcAmount)
    }];
    const [res_status, ] = await sendTransaction(
      connection,
      connectionConfig.env,
      wallet.wallet!,
      ix,
      metaData,
      signers,
    );
    if (res_status) setUsdtAmount('0')
  };
 
  return (
    <div>
      <CommonHeader side={true} heading={"House deposit & staking"} />
      <Divider />
      <div className="balance-container">
        <small className="text-secondary">Available to deposit:</small>
        <label className="balance">{tokenAmountToString(userUSDC)} USDC</label>
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
            }}>Amount to deposit: </label>
          <Input placeholder={"USDC"} name="usdcAmount" value={usdcAmount} onChange={event => setUsdtAmount(event.currentTarget.value)} style={isMobile ? {width: '80%', height: 50, paddingTop: 20} : {width: "50%"}} />
          <Button style={{border:"1px solid rgb(67, 67, 67)",  width:"20%", height: isMobile ? 50 : 32, padding:0}} onClick={e => setUsdtAmount((userUSDC / LAMPORTS_PER_USDC).toFixed(2).toString())} disabled={userUSDC === 0}>MAX</Button>
        </Input.Group>
      </Form.Item>
      <WalletSlider         
        onChange={(val: number) => setUsdtAmount((userUSDC / LAMPORTS_PER_USDC * val / 100).toFixed(2).toString()) }
        value={usdcAmount === "" ? 0: Number(usdcAmount) * LAMPORTS_PER_USDC / userUSDC * 100}
        disabled={userUSDC === 0}
      />
       <div style={{display:'flex', justifyContent:'space-between', marginTop:'2.5em'}}>
        <Button style={{width:'100%', padding: '0.6em', height:'auto'}}>
          <LinkLabel style={{ margin:"auto" }}>
            <span>Approve</span>
          </LinkLabel>
        </Button>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', marginTop:'1em', flexDirection: isMobile ? 'column' : 'row'}}>
        <Button onClick={onDeposit} disabled={Number(usdcAmount) === 0} style={{width: isMobile ? '100%' : '48%', padding: '0.6em', height:'auto'}}>
          <LinkLabel style={{ margin:"auto" }}>
            <span>Deposit</span>
          </LinkLabel>
        </Button>
        <Button style={{width: isMobile ? '100%' : '48%', padding: '0.6em', height:'auto', marginTop: isMobile ? '1em' : 0}}>
          <LinkLabel style={{ margin:"auto" }}>
            <span>Deposit &amp; Stake</span>
          </LinkLabel>
        </Button>
      </div>

      <Divider />
      <div className="balance-container">
        <small className="text-secondary">House token balance:</small>
        <label className="balance">HT</label>
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
            }}>Amount to stake: </label>
          <Input placeholder={"House Token"} style={isMobile ? {width: '80%', height: 50, paddingTop: 20} : { width: "50%" }} />
          <Button style={{ border: "1px solid rgb(67, 67, 67)", width:"20%", height: isMobile ? 50 : 32, padding:0}}>MAX</Button>
        </Input.Group>
      </Form.Item>
      <WalletSlider 
        onChange={(val: number) => {} }
        value={0}
        disabled={userHT === 0}
      />
    </div>
  );
};
