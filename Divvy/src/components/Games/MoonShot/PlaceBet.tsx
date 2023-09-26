import {Button, Form, Input} from "antd";
import { useState } from "react";
import { useConnection, useConnectionConfig } from "../../../contexts/sol/connection";
import { useWallet } from "../../../contexts/sol/wallet";
import { useAccountByMint } from "../../../hooks";
import { BustBet } from "../../../models/games/moonshot/bets";
import { initBustBet } from "../../../models/sol/instruction/initBustBetInstruction";
import { useStoreBetsMutation } from "../../../store/games/moonshot/storeBet";
import { getUsdtMint } from "../../../utils/ids";

const PlaceBet = () => {
    const [storeBets, { isLoading: isUpdating }] = useStoreBetsMutation();
    const [risk, setRisk] = useState(0);
    const [payout, setPayout] = useState(0);
    const [multiplier, setMultplier] = useState(1);
    const { connected, connect, select, provider } = useWallet();
    const wallet = useWallet();
    const connection = useConnection();
    const connectionConfig = useConnectionConfig();
    const usdcTokenAccount = useAccountByMint(getUsdtMint(connectionConfig.env));
  
    const onFinish = async (values: any) => {
        let bet: BustBet = {
            "risk": risk,
            "userPubkey": wallet?.publicKey?.toString()?wallet?.publicKey?.toString(): "",
            "payout": JSON.parse(values.payout),
            "status": 0,
            "placedOn": (new Date()).toUTCString(),
            "userUSDTPubkey": "",
            "multiplier": multiplier,
        }
        const [ok,] = await initBustBet(
            connection,
            connectionConfig.env,
            wallet.wallet,
            usdcTokenAccount?.pubkey, bet);
        const res = await storeBets(bet);
        if("data" in res) {
            if(res.data?.success) {
                alert("Bet added successfully")
            } else {
                // console.log("Bet adding failed");
            }
        }
    }
    return (
        <Form name="control-hooks" onFinish={onFinish}>
            <Form.Item name="bet" label="Bet (in $)">
                <Input />
            </Form.Item>
            <Form.Item name="payout" label="Payout">
                <Input />
            </Form.Item>
            <Form.Item name="multiplier" label="Multiplier">
                <Input value={multiplier} onInput={(event)=> {setMultplier(parseInt(event.currentTarget.value))}} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isUpdating}>
                    Place Bet
                </Button>
            </Form.Item>
        </Form>
    )
}
export default PlaceBet;
