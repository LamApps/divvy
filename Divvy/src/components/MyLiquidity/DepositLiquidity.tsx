import { PublicKey } from "@solana/web3.js";
import { Form, Input, Button, Tooltip } from "antd";
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
import { InfoCircleOutlined } from "@ant-design/icons"
import { WalletSlider } from "./WalletSlider"
import { depositLiquidityTransaction } from "../../models/sol/instruction/depositLiquidityInstruction";
import { useContext, useState, useEffect } from "react";
import { UserUSDCContext } from "../../contexts/sol/userusdc";
import { LAMPORTS_PER_USDC, tokenAmountToString, Transactions } from "../../constants";
import * as IDS from "../../utils/ids"

export const DepositLiquidity = (props: { isLoading: boolean, data: Array<Market> | undefined }) => {
  const wallet = useWallet();
  const connection = useConnection();
  const connectionConfig = useConnectionConfig();
  const htTokenAccount = useAccountByMint(IDS.HT_MINT)
  const usdcTokenAccount = useAccountByMint(IDS.getUsdtMint(connectionConfig.env))
  const { userUSDC } = useContext(UserUSDCContext)
  let [usdcAmount, setUsdtAmount] = useState("");

  useEffect(() => {
    if(userUSDC === 0) setUsdtAmount("")
  }, [userUSDC])

  const onFinish = async () => {
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
    <div className="sidebar-section form-grey">
      <div>
        {
          !props.isLoading && props.data && props.data.length ? 
          <Tooltip title={LABELS.ACTIVE_GAMES_WARNING}>
            <h3>Divvy House Deposit <InfoCircleOutlined style={{ fontSize: 9, marginTop:3.4, marginLeft:2 }} /></h3>
          </Tooltip>
          :
          <h3>Divvy House Deposit</h3>
        }
        <div className="balance-container">
          <p>
            <small className="text-secondary">Wallet balance</small>
          </p>
          <p className="balance">{tokenAmountToString(userUSDC)} USDC</p>
        </div>

        <Form.Item name="usdcAmount" style={{marginBottom: '1em'}}>
          <Input.Group compact>
            <Input placeholder={"USDC"} name="usdcAmount" value={usdcAmount} onChange={event => setUsdtAmount(event.currentTarget.value)} style={{width: "70%"}} />
            <Button style={{border:"1px solid rgb(67, 67, 67)",  width:"30%", padding:0}} onClick={e => setUsdtAmount((userUSDC / LAMPORTS_PER_USDC).toFixed(2).toString())} disabled={userUSDC === 0}>MAX</Button>
          </Input.Group>
        </Form.Item>

        <WalletSlider         
          onChange={(val: number) => setUsdtAmount((userUSDC / LAMPORTS_PER_USDC * val / 100).toFixed(2).toString()) }
          value={usdcAmount === "" ? 0: Number(usdcAmount) * LAMPORTS_PER_USDC / userUSDC * 100}
          disabled={userUSDC === 0}
        />

        <Button onClick={onFinish} disabled={Number(usdcAmount) === 0}>
          Deposit
        </Button>
      </div>
    </div>
  );
};
