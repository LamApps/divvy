import {Table} from "antd";
import { LEADERBOARD_DUMMY_DATA } from "../../../constants/dymmyData";

const BetsTable = () => {
    const DASHBOARD_COLUMNS = [
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: '@',
            dataIndex: 'multiplier',
            key: 'multiplier',
        },
        {
            title: 'Bet',
            dataIndex: 'bet',
            key: 'bet',
        },
        {
            title: 'Profit',
            dataIndex: 'profit',
            key: 'profit',
        }
    ]
    return (
        <Table
            columns={DASHBOARD_COLUMNS}
            dataSource={LEADERBOARD_DUMMY_DATA}
            pagination={false}
            // onChange={handleChange}
        />
    )
}
export default BetsTable;
