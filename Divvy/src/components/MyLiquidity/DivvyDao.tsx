import { Button } from "antd";

export const DivvyDao = () => {
    return (
        <div className="sidebar-section">
            <h3>Divvy DAO</h3>

            <div className="balance-container">
                <p>
                    <small className="text-secondary">Staked Balance</small>
                </p>
                <p className="balance">0.00 HT</p>
            </div>

            <div className="balance-container">
                <p>
                    <small className="text-secondary">DVY Reward</small>
                </p>
                <p className="balance">0.00 DVY</p>
            </div>
            
            <div style={{ display: "flex" }}>
                <Button type="primary" htmlType="submit" disabled={true}>
                    Withdraw
                </Button>
                <Button style={{ marginLeft: 10}} type="primary" htmlType="submit" disabled={true}>
                    Withdraw & Claim
                </Button>
            </div>
        </div >
    );
};
