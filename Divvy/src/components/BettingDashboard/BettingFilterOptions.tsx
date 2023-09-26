import { Select } from 'antd';
import { DownOutlined } from "@ant-design/icons";
const { Option } = Select;
export const BettingFilterOptions = (props: { setFilteredInfo : any }) => {
    const handleChange = (val : string) => {
        props.setFilteredInfo({ sport: [val] })
    }
    return (
        <div>
            <div className="header-align" style={{flexDirection: 'column'}}>
                <span >Show: </span>
                <Select defaultValue="All Bets" onChange={handleChange} suffixIcon={<DownOutlined style={{marginTop: 0, color: "#fff"}} className="direction-icon" />}>
                    <Option value="">All Bets</Option>
                    <Option value="Football">Football</Option>
                    <Option value="Baseball">Baseball</Option>
                </Select>
            </div>
        </div>
    );
};