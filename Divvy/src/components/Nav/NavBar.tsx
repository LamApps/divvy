import { BetsViewLink } from "./BetsViewLink";
import { DivvyLinks } from "./DivvyLinks";
import { LiquidityViewLink } from "./LiquidityViewLink";
import { MyDashboardLink } from "./MyDashboardLink";
import { MarketsLink } from "./MarketsLink";
import { Button, Input } from 'antd'
import { SearchOutlined, CloseOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react";
import { USDCFaucetLink } from "./USDCFaucet";
import { DivvyGamesLink } from "./DivvyGames";
import { DivvyNFTS } from "./DivvyNFTS";
import { useMediaQuery } from "../../utils/utils";

export const NavBar = () => {
  const [search, setSearch] = useState("")
  let isMobile = useMediaQuery('(max-width: 400px)')
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <BetsViewLink />
      {/* <DivvyNFTS /> */}
      {/* <DivvyLinks /> */}
      <div style={isMobile ? {display: 'flex'} : {display: 'block'}}>
        <LiquidityViewLink />
        <MyDashboardLink />
      </div>
      {/* <DivvyGamesLink /> */}
      {/* <USDCFaucetLink /> */}
      <Input
        value={search}
        style={{ border: "0px", padding: "1em", marginTop: "1px",  outline: "1px solid #1f1f1f", height: "50px", width: "100%" }}
        placeholder={"Search for bets"}
        prefix={<SearchOutlined />}
        suffix={!isMobile ? <CloseOutlined onClick={() => setSearch('')} /> : <></>}
        onChange={(event) => setSearch(event.currentTarget.value)}
      />
      <MarketsLink search={search} />
      <div style={isMobile ? {display: 'flex', flexDirection: 'inherit'} : {display: 'none'}}>
        <Button type="text" onClick={() => setSearch('')}>Clear Search</Button>
      </div>
    </div>
  );
};
