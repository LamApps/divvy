import { RightOutlined } from "@ant-design/icons";
import { CSSProperties } from "react";

const LinkLabel = ({children = null as any, style = undefined as CSSProperties | undefined} ) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", ...style}}>
      {children}
      <RightOutlined  />
    </div>
  )
}
export default LinkLabel;