import { u64 } from "@solana/spl-token";
import { Col, Input, Layout, Row, Button } from "antd";
import { useState } from "react";
import { LeftSideBar } from "../components/LeftSideBar";
import { MobileHeader } from "../components/Nav/Mobile/MobileHeader";
import { NavBar } from "../components/Nav/NavBar";
import { HeaderTypes } from "../constants/HeaderTypes";
import { useConnection } from "../contexts/sol/connection";
import { useWallet } from "../contexts/sol/wallet";
import { airdropTokens } from "../models/sol/instruction/usdcFaucet";
import { useAccountByMint } from "../hooks";
import { FAUCET_PROGRAM_ID, USDC_MINT_DEVNET } from "../utils/ids";
import { PublicKey } from "@solana/web3.js";
import { MONEY_LINE_BET_LAYOUT } from "../models/sol/state/moneyLineBet";
import { MARKET_STATE_ACCOUNT_DATA_LAYOUT } from "../models/sol/state/marketState";
import { HPStateParser, HP_STATE_LAYOUT } from "../models/sol/state/hpState";
import { ConnectLink } from "../components/Nav/ConnectLink";
import { notify } from "../utils/notifications";
import { useMediaQuery } from "../utils/utils";

export const FaucetView = () => {
    const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [isBetSlipsVisible, setBetSlipsVisible] = useState(false);
    const wallet = useWallet();
    const { connected } = useWallet();
    const connection = useConnection();
    const usdcAddress = useAccountByMint(USDC_MINT_DEVNET);
    const callUSDCFaucet = async () => {
        airdropTokens(usdcAddress?.pubkey, FAUCET_PROGRAM_ID, new u64(10000000000, 10), connection, wallet.wallet)
    }
    const [inspectPubkey, setInspectPubkey] = useState("");
    const [inspectAccount, setInspectAccount] = useState<string>("");
    let isMobile = useMediaQuery('(max-width: 400px)');

    const tryInspect = async (pubkeyString: string) => {
        setInspectPubkey(pubkeyString);
        let pubkey: PublicKey;
        try {
            pubkey = new PublicKey(pubkeyString);
        } catch (ex) {
            setInspectAccount("");
            return;
        }
        let account = await connection.getAccountInfo(pubkey);
        if (account) {
            if (account.data.length === MONEY_LINE_BET_LAYOUT.span) {
                setInspectAccount(JSON.stringify(MONEY_LINE_BET_LAYOUT.decode(account.data), null, 2));
            } else if (account.data.length === MARKET_STATE_ACCOUNT_DATA_LAYOUT.span) {
                setInspectAccount(JSON.stringify(MARKET_STATE_ACCOUNT_DATA_LAYOUT.decode(account.data), null, 2));
            } else if (account.data.length === HP_STATE_LAYOUT.span) {
                setInspectAccount(JSON.stringify(HPStateParser(pubkey, account), null, 2));
            } else {
                setInspectAccount(`Account data has an unfamiliar length of ${account.data.length}. Are you missing a buffer layout or are they out of date?`);
            }
        } else {
            setInspectAccount("");
        }
    }

    const requestSolAirdrop = async () => {
        if(wallet?.publicKey){
            await connection.requestAirdrop(wallet?.publicKey, 1000000000);
            notify({message: 'Succesfully Airdropped 1 SOL'})
        }
    }

    return (
        <Layout style={{ backgroundColor: "#0D0D0D" }}>
            <Row>
                <Col xs={24} sm={24} md={0}>
                    <MobileHeader headerType={HeaderTypes.Bets} isBetSlipsVisible={isBetSlipsVisible} setBetSlipsVisible={setBetSlipsVisible} isMobileMenuVisible={isMobileMenuVisible} setMobileMenuVisible={setMobileMenuVisible} />
                </Col>
                <Col span={4} xs={isMobileMenuVisible ? 24 : 0} sm={isMobileMenuVisible ? 24 : 0} md={4}>
                    <LeftSideBar>
                        <NavBar />
                    </LeftSideBar>
                </Col>
                {(!isMobile || !isMobileMenuVisible && !isBetSlipsVisible) &&
                    <Col span={24} xs={24} sm={24} md={20}>
                        <header className="root-content">
                            <ConnectLink />
                            {connected ? "" : "Please connect your wallet"}
                            <br />
                            <br />
                            {/* <Button onClick={() => requestSolAirdrop()}>
                                Get 1 SOL
                            </Button> */}
                            <br />
                            <br />
                            <Button onClick={() => callUSDCFaucet()}>
                                Get 10K USDC
                            </Button>
                            {/* <br />
                            <br />
                            <Input placeholder="Enter a Solana public key to inspect the account." value={inspectPubkey} onChange={event => { tryInspect(event.currentTarget.value) }} style={{ width: "40%" }} />
                            <pre>
                                {inspectAccount}
                            </pre> */}
                        </header>
                        <Layout>
                        </Layout>
                    </Col>
                }
            </Row>
        </Layout>
    )
}