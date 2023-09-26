import React from "react";
import { Link } from "react-router-dom";
import { GAMES_VIEW_PATH } from "../../constants";
import LinkLabel from "./LinkLabel";
export const DivvyGamesLink = () => {

  return (
    <Link
      to={GAMES_VIEW_PATH}>
      <div className="sidebar-section text-secondary">
        {/* Link to the real MyDashboard when it is complete */}
        <LinkLabel style={{ marginBottom: "0.83em" }}>
          <h2 style={{ marginBottom: 0 }}>Divvy Games</h2>
        </LinkLabel>
        <small>
          <div className="balance-container">
          </div>
        </small>
      </div>
    </Link>
  );
};
