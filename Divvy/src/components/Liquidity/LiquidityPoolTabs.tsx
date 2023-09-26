import { Divider } from 'antd';

export const LiquidityPoolTabs = (props: { poolPerformance: number, setPoolPerformance: any }) => {
    const changeGraph = (tab : number) => {
        props.setPoolPerformance(tab);
    }
    return (
        <div className="switch-tabs pool-performance-tabs">
            <div onClick={() => changeGraph(0)} className={props.poolPerformance === 0 ? "switch-tab-active" : "switch-tab"}>Pool Balance</div>
            <Divider type="vertical" style={{visibility: props.poolPerformance == 2 ? 'visible' : 'hidden'}}/>
            <div onClick={() => changeGraph(1)} className={props.poolPerformance === 1 ? "switch-tab-active" : "switch-tab"}>House Earnings</div>
            <Divider type="vertical" style={{visibility: props.poolPerformance == 0 ? 'visible' : 'hidden'}}/>
            <div onClick={() => changeGraph(2)} className={props.poolPerformance === 2 ? "switch-tab-active" : "switch-tab"}>Betting Volume</div>
            <div className='slider' style={{left: `${props.poolPerformance * 33}%`, width: '33%'}}>{props.poolPerformance == 0 ? 'Pool Balance' : props.poolPerformance == 1 ? 'House Earnings' : 'Betting Volume'}</div>
        </div>
  );
}
