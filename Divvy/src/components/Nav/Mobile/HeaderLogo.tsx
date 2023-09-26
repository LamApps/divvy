import Logo from "../../../img/divvy-logo.png"
import { BETS_VIEW_PATH } from "../../../constants"
import { Link } from "react-router-dom";
export const HeaderLogo = () => {
    return (
        <div style={{ marginTop: 6 }}>
            <Link to={BETS_VIEW_PATH}>
                <img style={{ width: 24, height: 24, marginTop: 8 }} src={Logo} alt="Logo" />
            </Link>
        </div>
    );
};
