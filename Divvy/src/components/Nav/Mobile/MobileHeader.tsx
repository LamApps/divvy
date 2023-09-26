import { Row, Col } from "antd";
import { WalletBalance } from "./WalletBalance";
import { MobileBetSlip } from "./BetSlip";
import { MobileMenu } from "./Menu";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderTypes } from "../../../constants/HeaderTypes";
import { HousePoolHeader } from "./HousePoolHeader";
export const MobileHeader = (props: { isMobileMenuVisible: boolean, setMobileMenuVisible: any, isBetSlipsVisible: boolean, setBetSlipsVisible: any, headerType: string }) => {
  return (
        <Row style={props.isMobileMenuVisible ? {position: 'absolute', top: 0, width: '100%', zIndex: 1} : {}}>
            <Col className="mobile-header" span={4} style={props.isMobileMenuVisible ? {visibility: 'hidden'} : {}}>
                <HeaderLogo />
            </Col>
            <Col className="mobile-header" span={
                (props.headerType === HeaderTypes.Dashboard) || props.headerType == HeaderTypes.Liquidity && !props.isBetSlipsVisible 
                ? 15 : 10} style={props.isMobileMenuVisible ? {visibility: 'hidden'} : {}}>
                <WalletBalance />
            </Col>
            { props.headerType !== HeaderTypes.Dashboard ?
                <Col className="mobile-header" span={5} style={
                    props.isMobileMenuVisible ? {visibility: 'hidden'} :
                    !props.isBetSlipsVisible && props.headerType == HeaderTypes.Liquidity ? {display: 'none'} : {}}
                >
                    {props.headerType === HeaderTypes.Bets ?
                        <MobileBetSlip isBetSlipsVisible={props.isBetSlipsVisible} setBetSlipsVisible={props.setBetSlipsVisible} setMobileMenuVisible={props.setMobileMenuVisible} /> :
                        <HousePoolHeader isBetSlipsVisible={props.isBetSlipsVisible} setBetSlipsVisible={props.setBetSlipsVisible} setMobileMenuVisible={props.setMobileMenuVisible} />
                    }
                </Col>
                :
                <></>
            }
            <Col className="mobile-header" span={5} style={props.isMobileMenuVisible ? {border: 'none', marginTop: '15px'} : {}}>
                <MobileMenu isMobileMenuVisible={props.isMobileMenuVisible} setMobileMenuVisible={props.setMobileMenuVisible} setBetSlipsVisible={props.setBetSlipsVisible} />
            </Col>
        </Row>
    );
};
