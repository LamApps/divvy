import { About } from "./About";
import { Header } from "./Header";
import { BeTheHouse } from "./BeTheHouse";
import { Footer } from "./Footer";
import "./style.css"
import { Difference } from "./Difference";
import { DAO } from "./DAO";
import { Tokenomics } from "./Tokenomics";
import { Roadmap } from "./Roadmap";
import { Community } from "./Community";
import Fade from "react-reveal/Fade";
import { NFTBanner } from "./NftBanner";

export const LandingPage = () => {
    return (
        <div className="landing-page">
            <div className="container">
                <Header />

                <Fade duration={1500}>
                    <NFTBanner />
                </Fade>
                
                <Fade duration={1500}>
                    <About />
                </Fade>

                <Fade duration={1500}>
                    <BeTheHouse />
                </Fade>

                <Difference />

                <Fade up duration={1500}>
                    <DAO />
                </Fade>

                <Fade up duration={1500}>
                    <Tokenomics />
                </Fade>

                <Fade up duration={1500}>
                    <Roadmap />
                </Fade>

                <Fade up duration={1500}>
                    <Community />
                </Fade>
                <Footer />
            </div>
        </div>
    );
};
