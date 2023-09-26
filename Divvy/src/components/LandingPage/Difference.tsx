import imgFair from '../../img/landing-page/divvy_fair.png'
import imgTrustworthy from '../../img/landing-page/divvy_trustworthy.png'
import imgTransparent from '../../img/landing-page/divvy_transparent.png'
import imgNonCustodial from '../../img/landing-page/divvy_noncustodial.png'
import imgEfficient from '../../img/landing-page/divvy_efficient.png'
import {DifferenceCard} from './DifferenceCard'
const Fade = require('react-reveal/Fade')

export const Difference = () => {
    return (
      <section className="landing-page__difference">
        <div>
          <Fade left>
            <h2 className="heading-lg">The Divvy Difference</h2>
          </Fade>
      
          <Fade left>
            <DifferenceCard
              title='Fair'
              description='Divvy allows Liquidity Providers to participate on an equal footing with the bettors by investing their funds into the House pool.'
              image={imgFair}
            ></DifferenceCard>
          </Fade>
          
          <Fade left>
            <DifferenceCard
              title='Trustworthy'
              description='Due to the immutable nature of smart contracts, all payouts are guaranteed and bets are settled instantly and autonomously.'
              image={imgTrustworthy}
            ></DifferenceCard>
          </Fade>
        </div>
        <div>
          <Fade right>
            <DifferenceCard
              title='Transparent'
              description='Every transaction is verifiable on the Solana blockchain, providing an industry leading level of security.'
              image={imgTransparent}
            ></DifferenceCard>
          </Fade>
          
          <Fade right>
            <DifferenceCard
              title='Non-Custodial'
              description='The concepts of deposits and withdrawals are eliminated for bettors thanks to Web3 and the non-custodial nature of the blockchain.'
              image={imgNonCustodial}
            ></DifferenceCard>
          </Fade>
          
          <Fade right>
            <DifferenceCard
              title='Efficient'
              description='Thanks to the advancements of Solana, transaction fees are kept to a minimum while providing unmatched scalability.'
              image={imgEfficient}
            ></DifferenceCard>
          </Fade>

        </div>
      </section>
    );
};
  