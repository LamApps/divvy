import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const Loader = () => {
    return (
        <Spin indicator={antIcon} />
    )
}