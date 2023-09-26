import { PicRightOutlined, CloseOutlined } from "@ant-design/icons";
import { Badge, Button } from 'antd';
import { useContext } from "react";
import { BetsContext } from "../../../contexts/bets";
export const MobileBetSlip = (props: { isBetSlipsVisible: boolean, setBetSlipsVisible: any, setMobileMenuVisible: any }) => {
  const bets = useContext(BetsContext);  
  return (
        <Button style={{ backgroundColor: "transparent", borderColor: "transparent", borderWidth: 0, padding: 0, width: "100%", height: "100%" }} onClick={() => { props.setMobileMenuVisible(false); props.setBetSlipsVisible(!props.isBetSlipsVisible) }}>
            {props.isBetSlipsVisible ? <CloseOutlined /> :
                <Badge style={{ backgroundColor: "#7c01ff", right: -14 }} size="default" count={bets?.bets.length}>
                    <PicRightOutlined />
                </Badge>
            }
            <br />
            Bet Slips
        </Button>
    );
};
