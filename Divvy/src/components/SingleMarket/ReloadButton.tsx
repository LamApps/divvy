import { Progress, Tooltip } from 'antd';
import { useState, useEffect, useRef } from 'react';

export const ReloadButton = (props: { refetch: any }) => {
    const [timer, setTimer] = useState(100);
    let countDown = useRef(0);
    const reFetch = () => {
        props.refetch();
        window.clearTimeout(countDown.current);
        setTimer(100);
    }
    useEffect(() => {
        if(timer <= 0) {
            reFetch();
            return;
        }
        countDown.current = window.setTimeout(() => {
            setTimer(timer-((1/30)*100));
        }, 1000);;
    }, [timer])
    return (
        <div className="reload-container" onClick={() => reFetch()}>
            <Tooltip title="Data will auto-refresh after every 30 seconds, click to refresh now">
                <Progress type="circle" percent={timer} width={20} format={() => ''} />
            </Tooltip>
        </div>
    )
}