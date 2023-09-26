export const BetSwitch = (props: { switchVal: number, setSwitchVal: any }) => {
    const changeTab = (num: number) => {
        props.setSwitchVal(num);
    }
    return (
        <div className="switch-tabs switch-tabs-small" style={{maxWidth: '200px', border: '1px solid', borderRadius: '30px', position: 'relative'}}>
            <div onClick={() => changeTab(0)} className={"switch-tab switch-tab-small"}>
                <span>Matches</span>
            </div>
            <div onClick={() => changeTab(1)} className={"switch-tab switch-tab-small"}>
                <span>Futures</span>
            </div>
            <div
                className={"switch-tab-active switch-tab-small"}
                style={{
                    position: 'absolute',
                    width: '50%',
                    height: '100%',
                    color: 'black',
                    background: 'white',
                    borderRadius: '30px',
                    top: 0,
                    left: `${props.switchVal * 50}%`,
                    transition: 'all 0.3s ease',
                }}
            >
                <span>{props.switchVal == 0 ? 'Matches' : 'Futures'}</span>
            </div>
        </div>
    );
};