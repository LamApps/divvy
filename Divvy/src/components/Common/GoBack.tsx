import { ArrowLeftOutlined } from "@ant-design/icons";
import { Row, Button } from "antd";
import { Link } from "react-router-dom";
export const GoBack = (props: { path: string, label: string }) => {
  return (
    <Row>
      <Link to={props.path} className="root" style={{justifyContent: "center", alignItems: "center"}}>
        <Button>
          <ArrowLeftOutlined />
          <span style={{margin: "2px 0 0 10px"}}>{props.label}</span>
        </Button>
      </Link>
    </Row>
  );
};