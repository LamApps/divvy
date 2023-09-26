import { useContext, useState } from "react";
import { Bet, BetStatus } from "../../constants";
import { BetsContext } from "../../contexts/bets";
import { BetSlip } from "../Bets/BetSlip";
import { PendingBets } from "../Bets/PendingBets";
export const BetSidebar = () => {
  const bets = useContext(BetsContext);
  const [active, setActive] = useState("slips")
  var slips = 0
  var pending = 0
  bets?.bets.forEach((value: Bet) => {
    if (value.status === BetStatus.Current) {
      slips++;
    }
    else {
      pending++;
    }
  })
  return (
    <div className="sidebar-section-bets">
      <div style={{ display: "flex" }}>
        <div onClick={() => setActive('slips')} className={active === "slips" ? "bets-active bets-left" : "bets-left"}>
          <h3>Bet Slip ({slips})</h3>
        </div>
        <div onClick={() => setActive('pending')} className={active === "pending" ? "bets-active bets-right" : "bets-right"}>
          <h3>Pending ({pending})</h3>
        </div>
      </div>
      {
        active === "slips" 
        ? <BetSlip/> 
        : <PendingBets/>
      }
    </div>
  );
};
