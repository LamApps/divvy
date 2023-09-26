import { ReactComponent as Logo } from "../../img/Divvy_UI_Logo_Beta.svg"
import { Link } from "react-router-dom";
import { BETS_VIEW_PATH } from "../../constants"

export const BetsViewLink = () => {
  return (
    <Link to={BETS_VIEW_PATH}>
      <div className="sidebar-section" style={{display:"flex", alignContent:"center", padding: '1.5em'}}>
        <Logo/>
      </div>
    </Link>
  );
};
