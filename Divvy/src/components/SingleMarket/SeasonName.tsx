import { Tag } from 'antd';
export const SeasonName = (props: { name: string, matches: number }) => {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <h2>{props.name}</h2>
            <Tag style={{ marginTop: -8, color: 'gray', marginLeft: 6 }}>{props.matches} Matches</Tag>
        </div>
    );
};
