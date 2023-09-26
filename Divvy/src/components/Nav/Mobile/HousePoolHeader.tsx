import { DollarOutlined, CloseOutlined } from "@ant-design/icons";
import { Badge, Button, Menu, Modal } from 'antd';
export const HousePoolHeader = (props: { isBetSlipsVisible: boolean, setBetSlipsVisible: any, setMobileMenuVisible: any }) => {
    return (
        <Button style={{ backgroundColor: "transparent", borderColor: "transparent", borderWidth: 0, padding: 0, width: "100%", height: "100%" }} onClick={() => { props.setMobileMenuVisible(false); props.setBetSlipsVisible(!props.isBetSlipsVisible) }}>
            {props.isBetSlipsVisible ? <CloseOutlined /> :
                <DollarOutlined />
            }
            <br />
            House Pool
        </Button>
    );
};
