import { useContext, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Form, Input, Button } from "antd";
import { LAMPORTS_PER_HP as LAMPORTS_PER_HT, tokenAmountToString, Transactions } from "../../constants";
import {
  useConnection,
  useConnectionConfig,
  sendTransaction,
} from "../../contexts/sol/connection";
import { useWallet } from "../../contexts/sol/wallet";
import { WalletSlider } from "./WalletSlider"
import { notify } from "../../utils/notifications";
import { useAccountByMint } from "../../hooks";
import { depositLiquidityTransaction } from "../../models/sol/instruction/depositLiquidityInstruction";
import * as IDS from "../../utils/ids";
import { UserHTContext } from "../../contexts/sol/userht";

export const StakeHT = () => {
  const wallet = useWallet();
  const connection = useConnection();
  const connectionConfig = useConnectionConfig();
  const htTokenAccount = useAccountByMint(IDS.HT_MINT)
  const usdcTokenAccount = useAccountByMint(IDS.getUsdtMint(connectionConfig.env))
  const { userHT } = useContext(UserHTContext);
  let [htAmount, setHtAmount] = useState("");

  const onFinish = async (values: any) => {
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

    const [ix, signers] = await depositLiquidityTransaction(
      connection,
      wallet.wallet.publicKey,
      htTokenAccount.pubkey,
      usdcTokenAccount?.pubkey,
      IDS.getUsdtMint(connectionConfig.env),
      "withdraw",
      htLamports,
      bumpSeed);
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
    <div className="sidebar-section">
      <h3>Stake your House Tokens</h3>
      <div className="balance-container">
          <p>
            <small className="text-secondary">House Token Balance</small>
          </p>
          <p className="balance">{tokenAmountToString(userHT)} HT</p>
      </div>
      <Form.Item
        name="usdcAmount"
        rules={[{ required: true, message: "Please input the USDC amount." }]}>
        <Input.Group compact>
          <Input placeholder={"House Token"} value={htAmount} onChange={event => setHtAmount(event.currentTarget.value)} style={{ width: "75%" }} />
          <Button style={{ border: "1px solid rgb(67, 67, 67)" }} onClick={e => setHtAmount(tokenAmountToString(userHT))}>MAX</Button>
        </Input.Group>
      </Form.Item>

      <WalletSlider 
        onChange={(val: number) => setHtAmount(tokenAmountToString(userHT * val / 100)) }
        value={Number(htAmount)}
        disabled={false}
      />

      <Button type="primary" htmlType="submit">
          Stake
      </Button>
    </div >
  );
};
