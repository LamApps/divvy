import React from "react";
import { Link } from "react-router-dom";
import { GAMES_VIEW_PATH } from "../../constants";
import LinkLabel from "./LinkLabel";
import siren from "../../assets/siren.gif"
export const DivvyLinks = () => {

  return (
    <Link target="_blank" rel="noopener noreferrer"
      to={{ pathname: "https://devpost.com/software/divvy-ayxup0"}}>
      <div className="sidebar-section text-secondary">
        {/* Link to the real MyDashboard when it is complete */}
        <LinkLabel style={{ marginBottom: "0.83em" }}>
          <h2 style={{ marginBottom: 0 }}>Vote for Divvy in the ignition hackathon! <img style={{width: 25, height: 25, marginBottom: 10}} src={siren} alt="" /></h2>
        </LinkLabel>
        <small>
          <div className="balance-container">
          </div>
        </small>
      </div>
    </Link>
  );
};
