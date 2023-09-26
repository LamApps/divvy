import React, {useContext, useEffect, useState} from "react";
import {MoonshotSocketContext} from "../../../contexts/moonshot-socket";
import {RocketAnimation} from "./RocketAnimation";

export const MultiplierRocket = (props: {val: string, setVal: Function, onBust: Function, onBusting: Function}) => {
    const [decimal, setDecimal] = useState<number>(2);
    const [isCoolDown, setCoolDown] = useState<boolean>(false);
    const socket = useContext(MoonshotSocketContext);
    let hash = '-', multiplier = 0, busting = false;

    useEffect(() => {
        const handleSocketEvent = (data: any) => {
            if (!data) return;
            hash = data.pubkey;
            setDecimal(data.config.DECIMAL);
            multiplier = data.multiplier;
            props.onBusting(true);
            busting = true;
        };
        const handleRocket = (data: any) => {
            if (data === undefined) return;
            props.setVal(data);
            setCoolDown(data <= 0);
            if (data < 0) {
                if (busting) props.onBust(multiplier, hash);
                props.onBusting(false);
                busting = false;
            }
        };
        socket.on('data', handleSocketEvent);
        socket.on('multiplier', handleRocket);
        return () => {
            socket.off('data', handleSocketEvent);
            socket.off('multiplier', handleRocket);
        };
    }, [socket]);
    return (
        <>
            <RocketAnimation multiplier={multiplier.toString()} val={parseFloat(props.val)} />
            <div style={{fontSize:'2em', color: isCoolDown ? 'gray' : 'white', backgroundColor:'var(--off-black)', borderRadius:'0.5em', padding:'0.2em', margin:'0 0.8em', textAlign:'center'}}>
                {(parseFloat(props.val) * (isCoolDown ? -1 : 1)).toFixed(decimal > 0 ? decimal : 2)}&times;
            </div>
        </>
    )
}
