import { useEffect } from 'react';
export const BettingSortOptions = (props: { sortBy: string, setSortBy: any,setSortedInfo: any }) => {
    const changeTab = (tab : string) => {
        props.setSortBy(tab);
        props.setSortedInfo({
            order: tab.includes('asc') ? 'ascend' : 'descend',
            columnKey: tab === 'placed' ? 'placed' : 'potential'
        })
    }
    useEffect(() => {
      changeTab("placed");
    }, [])
    return (
        <div className="balance-container" style={{color: "#fff"}}>
            <span>Sort by:&emsp;</span>
            <div className="switch-tabs switch-tabs-small">
                <div onClick={() => changeTab("placed")} className={props.sortBy === "placed" ? "switch-tab-active switch-tab-small" : "switch-tab switch-tab-small"}><span>Date Placed</span></div>
                <div onClick={() => changeTab("potential-dsc")} className={props.sortBy === "potential-dsc" ? "switch-tab-active switch-tab-small" : "switch-tab switch-tab-small"}>{"P&L"}(high to low)</div>
                <div onClick={() => changeTab("potential-asc")} className={props.sortBy === "potential-asc" ? "switch-tab-active switch-tab-small" : "switch-tab switch-tab-small"}>{"P&L"}(low to high)</div>
            </div>
        </div>
  );
};