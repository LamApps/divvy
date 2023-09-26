import divvyLogo from '../../img/landing-page/divvy_fold_temp.png'

export const About = () => {
  return (
    <section className="landing-page__about">
      <div className="content">
        <h1 className="heading-sm">Divvy is bringing DeFi to the gambling world to redefine the way people bet. Together, we'll create a completely decentralized protocol.</h1>
        <div className="cta">
          <a className="btn" href="/app">Our Devnet is now live</a>
        </div>
      </div>
      <div className="divvy-logo">
        <video poster={divvyLogo} autoPlay muted loop>
          <source src="https://storage.googleapis.com/divvy-cdn/assets/animated_logo.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
};
