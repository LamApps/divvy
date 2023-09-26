import logo from '../../img/landing-page/divvy_logo.svg'
import heart from '../../img/landing-page/heart.svg'

export const Footer = () => {
    return (
      <footer className="landing-page__footer">
          <div className="logo"><a href="/"><img src={logo} alt="Divvy" /></a></div>
          <div className="message">Be the House<br />Coming soon on Solana</div>
          <div className="copyright">&copy; 2021 Divvy.bet<br/><u>View Imprint</u></div>
          <div className="credits">Made with <img src={heart} alt="love" /> on<br />Earth, by humans</div>
      </footer>
    );
  };
  