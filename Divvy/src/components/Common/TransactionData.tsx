import { UpOutlined, DownOutlined } from "@ant-design/icons";
export const TransactionData = (props: { textContext: string, percentage: number, data: string }) => {
    return (
        <div style={{margin:'0 1.2vw'}}>
            {
                props.percentage > 0 ?
                <p className="text-primary">{props.textContext}: <span style={{color: "#16c57c"}}>{"+"+props.percentage+"%"} <UpOutlined className="direction-icon" /></span></p>
                :
                props.percentage === 0 ?
                <p className="text-primary">{props.textContext}: <span style={{color: "#d75752", marginTop: 1}}>NA</span></p>
                :
                <p className="text-primary">{props.textContext}: <span style={{color: "#d75752"}}>{"-"+props.percentage+"%"} <DownOutlined className="direction-icon" /></span></p>
            }
            <h3><span style={{fontSize: "1.8rem", fontWeight: 800}}>{props.data.split(" ")[0]}</span> {props.data.split(" ")[1]}</h3>
        </div>
    );
}