import { useEffect, useState } from "react";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Menu, Modal } from 'antd';
import { LeftSideBar } from "../../LeftSideBar";
import { NavBar } from "../NavBar";
const { SubMenu } = Menu;
export const MobileMenu = (props: { isMobileMenuVisible: boolean, setMobileMenuVisible: any, setBetSlipsVisible: any }) => {
    return (
        <Button style={{ backgroundColor: "transparent", borderColor: "transparent", borderWidth: 0, padding: 0, width: "100%", height: "100%" }} onClick={() => { props.setBetSlipsVisible(false); props.setMobileMenuVisible(!props.isMobileMenuVisible) }}>
            {props.isMobileMenuVisible ? <CloseOutlined /> : <MenuOutlined />}
            <br />
            {props.isMobileMenuVisible ? 'Close' : 'Menu'}
        </Button>
    );
};
