use solana_program::{program_error::ProgramError, program_pack::{IsInitialized, Pack, Sealed}, pubkey::Pubkey};

use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};

use crate::{error::ExchangeError::InvalidInstruction, pack_pubkey_option, unpack_pubkey_option};

pub struct MarketSide {
    pub odds_feed_account: Option<Pubkey>,
    pub points_feed_account: Option<Pubkey>,
    pub payout: u64,
    pub risk: u64,
}

pub struct Market {
    pub is_initialized: bool,
    pub market_sides: [MarketSide; 3],
    pub locked_liquidity: u64,
    pub result_feed: Pubkey,
    pub result: MarketOutcome,
    /// The amount of risk the bettors have entered into the market.
    /// When the market settles, this equals to the winning sides unsettled risk and payout
    pub bettor_balance: u64,
    pub pending_bets: u64,
    pub team_a_score: u16,
    pub team_b_score: u16,
    pub total_score: u16,
}

pub struct SolBust {
    pub is_initialized: bool,
    pub current_pubkey: Pubkey,
    pub previous_pubkey: Pubkey,
    pub current_multiplier: u32,
    pub previous_multiplier: u32,
}

pub struct Multiplier {
    pub multiplier: u32,
    pub counter: u64,
    pub busted: bool,
}

impl Multiplier {
    const LEN: usize = 13;
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![input, 0, Multiplier::LEN];
        let (multiplier, counter, busted) = array_refs![src, 4, 8, 1];
        let busted = match busted {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };
        Ok(Multiplier {
            multiplier: u32::from_le_bytes(*multiplier),
            counter: u64::from_le_bytes(*counter),
            busted
        })
    }

    pub fn pack(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, Multiplier::LEN];
        let (multiplier_dst,counter_dst, busted_dst) = mut_array_refs![dst, 4, 8, 1];

        let Multiplier {
            multiplier,
            counter,
            busted
        } = self;
        *multiplier_dst = multiplier.to_le_bytes();
        *counter_dst = counter.to_le_bytes();
        busted_dst[0] = *busted as u8;
    }
}

pub struct BustBet {
    pub user_main_pubkey: Pubkey,
    pub user_usdt_pubkey: Pubkey,
    pub risk: u16,
    pub user_multiplier: u32,
    pub actual_multiplier_pubkey: Pubkey
}

impl BustBet {
    const LEN: usize = 102;
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![input, 0, BustBet::LEN];
        let (
            user_main_pubkey ,
            user_usdt_pubkey,
            risk,
            user_multiplier,
            actual_multiplier_pubkey
        ) = array_refs![src, 32, 32, 2, 4, 32];
        Ok(BustBet {
            user_main_pubkey: Pubkey::new_from_array(*user_main_pubkey),
            user_usdt_pubkey: Pubkey::new_from_array(*user_usdt_pubkey),
            risk: u16::from_le_bytes(*risk),
            user_multiplier: u32::from_le_bytes(*user_multiplier),
            actual_multiplier_pubkey: Pubkey::new_from_array(*actual_multiplier_pubkey),
        })
    }

    pub fn pack(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, BustBet::LEN];
        let (
            user_main_pubkey_dst ,
            user_usdt_pubkey_dst,
            risk_dst,
            user_multiplier_dst,
            actual_multiplier_pubkey_dst
        ) = mut_array_refs![dst, 32, 32, 2, 4, 32];

        let BustBet {
            user_main_pubkey ,
            user_usdt_pubkey,
            risk,
            user_multiplier,
            actual_multiplier_pubkey,
        } = self;
        user_main_pubkey_dst.copy_from_slice(user_main_pubkey.as_ref());
        user_usdt_pubkey_dst.copy_from_slice(user_usdt_pubkey.as_ref());
        *risk_dst = risk.to_le_bytes();
        *user_multiplier_dst = user_multiplier.to_le_bytes();
        actual_multiplier_pubkey_dst.copy_from_slice(actual_multiplier_pubkey.as_ref());
    }
}




#[derive(PartialEq, Clone, Copy)]
pub enum BetType {
    MoneyLine,
    Spread,
    Total,
}

impl BetType {
    pub fn unpack(input: &u8) -> Result<Self, ProgramError> {
        Ok(match input {
            0 => Self::MoneyLine,
            1 => Self::Spread,
            2 => Self::Total,
            _ => return Err(InvalidInstruction.into()),
        })
    }

    pub fn pack(&self) -> u8 {
        match *self {
            BetType::MoneyLine => 0,
            BetType::Spread => 1,
            BetType::Total => 2,
        }
    }
}

impl From<BetType> for &str {
    fn from(val: BetType) -> Self {
        match val {
            BetType::MoneyLine => "Money Line 3 Way",
            BetType::Spread => "Points Spread",
            BetType::Total => "Total Score",
        }
    }
}

pub struct BettingPoolState {
    pub is_initialized: bool,
    pub locked_liquidity: u64,
    pub live_liquidity: u64,
    pub pending_bets: u64,
    pub house_pool_usdt: Pubkey,
    pub betting_pool_usdt: Pubkey,
    pub insurance_fund_usdt: Pubkey,
    pub divvy_foundation_proceeds_usdt: Pubkey,
    pub frozen_betting: bool,
}

pub struct Bet {
    pub is_initialized: bool,
    pub market: Pubkey,
    pub user_usdt_account: Pubkey,
    pub user_main_account: Pubkey,
    pub user_risk: u64,
    pub user_payout: u64,
    pub points: u16,
    pub user_market_side: u8,
    pub outcome: u8,
    pub bet_type: BetType
}

#[derive(PartialEq, Clone, Copy)]
pub enum MarketOutcome {
    MarketSide0Won,
    MarketSide1Won,
    MarketSide2Won,
    NotYetCommenced,
    Commenced,
    Settled,
}

impl MarketOutcome {
    pub fn unpack(input: &u8) -> Result<Self, ProgramError> {
        Ok(match input {
            0 => Self::MarketSide0Won,
            1 => Self::MarketSide1Won,
            2 => Self::MarketSide2Won,
            3 => Self::NotYetCommenced,
            4 => Self::Commenced,
            _ => return Err(InvalidInstruction.into()),
        })
    }

    pub fn pack(&self) -> u8 {
        match *self {
            MarketOutcome::MarketSide0Won => 0,
            MarketOutcome::MarketSide1Won => 1,
            MarketOutcome::MarketSide2Won => 2,
            MarketOutcome::NotYetCommenced => 3,
            MarketOutcome::Commenced => 4,
            MarketOutcome::Settled => 5,
        }
    }
}
impl From<MarketOutcome> for &str {
    fn from(val: MarketOutcome) -> Self {
        match val {
            MarketOutcome::MarketSide0Won => "Market side 0 won",
            MarketOutcome::MarketSide1Won => "Market side 1 won",
            MarketOutcome::MarketSide2Won => "Market side 2 won",
            MarketOutcome::NotYetCommenced => "Not yet commenced",
            MarketOutcome::Commenced => "Commenced",
            MarketOutcome::Settled => "Settled",
        }
    }
}






impl Sealed for Market {}

impl Sealed for BettingPoolState {}

impl Sealed for Bet {}

impl Sealed for SolBust {}

impl IsInitialized for Market {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl IsInitialized for BettingPoolState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl IsInitialized for Bet {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl IsInitialized for SolBust {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}


impl Pack for Market {
    const LEN: usize = 310;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, Market::LEN];
        let (
            is_initialized,
            option_0_odds_pubkey,
            option_0_points_pubkey,
            option_0_loss,
            option_0_win,
            option_1_odds_pubkey,
            option_1_points_pubkey,
            option_1_loss,
            option_1_win,
            option_2_odds_pubkey,
            option_2_points_pubkey,
            option_2_loss,
            option_2_win,
            locked_liquidity,
            result_feed,
            result,
            bettor_balance,
            pending_bets,
            team_a_score,
            team_b_score,
            total_score
        ) = array_refs![src, 1, 33, 33, 8, 8, 33, 33, 8, 8, 33, 33, 8, 8, 8, 32, 1, 8, 8, 2, 2, 2];
        let is_initialized = match is_initialized {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };
        Ok(Market {
            is_initialized,
            market_sides: [
                MarketSide {
                    odds_feed_account: unpack_pubkey_option(option_0_odds_pubkey)?.0,
                    points_feed_account: unpack_pubkey_option(option_0_points_pubkey)?.0,
                    payout: u64::from_le_bytes(*option_0_loss),
                    risk: u64::from_le_bytes(*option_0_win),
                },
                MarketSide {
                    odds_feed_account: unpack_pubkey_option(option_1_odds_pubkey)?.0,
                    points_feed_account: unpack_pubkey_option(option_1_points_pubkey)?.0,
                    payout: u64::from_le_bytes(*option_1_loss),
                    risk: u64::from_le_bytes(*option_1_win),
                },
                MarketSide {
                    odds_feed_account: unpack_pubkey_option(option_2_odds_pubkey)?.0,
                    points_feed_account: unpack_pubkey_option(option_2_points_pubkey)?.0,
                    payout: u64::from_le_bytes(*option_2_loss),
                    risk: u64::from_le_bytes(*option_2_win),
                },
            ],
            locked_liquidity: u64::from_le_bytes(*locked_liquidity),
            result_feed: Pubkey::new_from_array(*result_feed),
            result: MarketOutcome::unpack(&(u8::from_le_bytes(*result))).unwrap(),
            bettor_balance: u64::from_le_bytes(*bettor_balance),
            pending_bets: u64::from_le_bytes(*pending_bets),
            team_a_score: u16::from_le_bytes(*team_a_score),
            team_b_score: u16::from_le_bytes(*team_b_score),
            total_score: u16::from_le_bytes(*total_score),
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, Market::LEN];
        let (
            is_initialized_dst,
            option_0_odds_pubkey_dst,
            option_0_points_pubkey_dst,
            option_0_loss_dst,
            option_0_win_dst,
            option_1_odds_pubkey_dst,
            option_1_points_pubkey_dst,
            option_1_loss_dst,
            option_1_win_dst,
            option_2_odds_pubkey_dst,
            option_2_points_pubkey_dst,
            option_2_loss_dst,
            option_2_win_dst,
            locked_liquidity_dst,
            result_feed_dst,
            result_dst,
            bettor_balance_dst,
            pending_bets_dst,
            team_a_score_dst,
            team_b_score_dst,
            total_score_dst,
        ) = mut_array_refs![dst, 1, 33, 33, 8, 8, 33, 33, 8, 8, 33, 33, 8, 8, 8, 32, 1, 8, 8, 2, 2, 2];

        let Market {
            is_initialized,
            market_sides,
            locked_liquidity,
            result_feed,
            result,
            bettor_balance,
            pending_bets,
            team_a_score,
            team_b_score,
            total_score,
        } = self;

        is_initialized_dst[0] = *is_initialized as u8;
        pack_pubkey_option(&market_sides[0].odds_feed_account, option_0_odds_pubkey_dst);
        pack_pubkey_option(
            &market_sides[0].points_feed_account,
            option_0_points_pubkey_dst,
        );
        *option_0_loss_dst = market_sides[0].payout.to_le_bytes();
        *option_0_win_dst = market_sides[0].risk.to_le_bytes();
        pack_pubkey_option(&market_sides[1].odds_feed_account, option_1_odds_pubkey_dst);
        pack_pubkey_option(
            &market_sides[1].points_feed_account,
            option_1_points_pubkey_dst,
        );
        *option_1_loss_dst = market_sides[1].payout.to_le_bytes();
        *option_1_win_dst = market_sides[1].risk.to_le_bytes();
        pack_pubkey_option(&market_sides[2].odds_feed_account, option_2_odds_pubkey_dst);
        pack_pubkey_option(
            &market_sides[2].points_feed_account,
            option_2_points_pubkey_dst,
        );
        *option_2_loss_dst = market_sides[2].payout.to_le_bytes();
        *option_2_win_dst = market_sides[2].risk.to_le_bytes();
        *locked_liquidity_dst = locked_liquidity.to_le_bytes();
        result_feed_dst.copy_from_slice(result_feed.as_ref());
        *result_dst = result.pack().to_le_bytes();
        *bettor_balance_dst = bettor_balance.to_le_bytes();
        *pending_bets_dst = pending_bets.to_le_bytes();
        *team_a_score_dst = team_a_score.to_le_bytes();
        *team_b_score_dst = team_b_score.to_le_bytes();
        *total_score_dst = total_score.to_le_bytes();
    }
}

impl Pack for BettingPoolState {
    const LEN: usize = 154;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, BettingPoolState::LEN];
        let (
            is_initialized,
            locked_liquidity,
            live_liquidity,
            pending_bets,
            house_pool_usdt,
            betting_pool_usdt,
            insurance_fund_usdt,
            divvy_foundation_proceeds_usdt,
            frozen_betting,
        ) = array_refs![src, 1, 8, 8, 8, 32, 32, 32, 32, 1];

        Ok(BettingPoolState {
            is_initialized: is_initialized[0] != 0,
            locked_liquidity: u64::from_le_bytes(*locked_liquidity),
            live_liquidity: u64::from_le_bytes(*live_liquidity),
            pending_bets: u64::from_le_bytes(*pending_bets),
            house_pool_usdt: Pubkey::new_from_array(*house_pool_usdt),
            betting_pool_usdt: Pubkey::new_from_array(*betting_pool_usdt),
            insurance_fund_usdt: Pubkey::new_from_array(*insurance_fund_usdt),
            divvy_foundation_proceeds_usdt: Pubkey::new_from_array(*divvy_foundation_proceeds_usdt),
            frozen_betting: frozen_betting[0] != 0,
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, BettingPoolState::LEN];
        let (
            is_initialized_dst,
            locked_liquidity_dst,
            live_liquidity_dst,
            pending_bets_dst,
            house_pool_usdt_dst,
            betting_pool_usdt_dst,
            insurance_fund_usdt_dst,
            divvy_foundation_proceeds_usdt_dst,
            frozen_betting_dst,
        ) = mut_array_refs![dst, 1, 8, 8, 8, 32, 32, 32, 32, 1];

        let BettingPoolState {
            is_initialized,
            locked_liquidity,
            live_liquidity,
            pending_bets,
            house_pool_usdt,
            betting_pool_usdt,
            insurance_fund_usdt,
            divvy_foundation_proceeds_usdt,
            frozen_betting,
        } = self;
        is_initialized_dst[0] = *is_initialized as u8;
        *locked_liquidity_dst = locked_liquidity.to_le_bytes();
        *live_liquidity_dst = live_liquidity.to_le_bytes();
        *pending_bets_dst = pending_bets.to_le_bytes();
        house_pool_usdt_dst.copy_from_slice(house_pool_usdt.as_ref());
        betting_pool_usdt_dst.copy_from_slice(betting_pool_usdt.as_ref());
        insurance_fund_usdt_dst.copy_from_slice(insurance_fund_usdt.as_ref());
        divvy_foundation_proceeds_usdt_dst.copy_from_slice(divvy_foundation_proceeds_usdt.as_ref());
        frozen_betting_dst[0] = *frozen_betting as u8;
    }
}

impl Pack for Bet {
    const LEN: usize = 118;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, Bet::LEN];
        let (
            is_initialized,
            market,
            user_usdt_account,
            user_main_account,
            user_risk,
            user_payout,
            points,
            user_market_side,
            outcome,
            bet_type,
        ) = array_refs![src, 1, 32, 32, 32, 8, 8, 2, 1, 1, 1];
        let is_initialized = match is_initialized {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };
        Ok(Bet {
            is_initialized,
            market: Pubkey::new_from_array(*market),
            user_usdt_account: Pubkey::new_from_array(*user_usdt_account),
            user_main_account: Pubkey::new_from_array(*user_main_account),
            user_risk: u64::from_le_bytes(*user_risk),
            user_payout: u64::from_le_bytes(*user_payout),
            points: u16::from_le_bytes(*points),
            user_market_side: u8::from_le_bytes(*user_market_side),
            outcome: u8::from_le_bytes(*outcome),
            bet_type: BetType::unpack(&bet_type[0])?,
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, Bet::LEN];
        let (
            is_initialized_dst,
            market_dst,
            user_usdt_account_dst,
            user_main_account_dst,
            user_risk_dst,
            user_payout_dst,
            points_dst,
            user_market_side_dst,
            outcome_dst,
            bet_type_dst,
        ) = mut_array_refs![dst, 1, 32, 32, 32, 8, 8, 2, 1, 1, 1];

        let Bet {
            is_initialized,
            market,
            user_usdt_account,
            user_main_account,
            user_risk,
            user_payout,
            points,
            user_market_side,
            outcome,
            bet_type,
        } = self;

        is_initialized_dst[0] = *is_initialized as u8;
        market_dst.copy_from_slice(market.as_ref());
        user_usdt_account_dst.copy_from_slice(user_usdt_account.as_ref());
        user_main_account_dst.copy_from_slice(user_main_account.as_ref());
        *user_risk_dst = user_risk.to_le_bytes();
        *user_payout_dst = user_payout.to_le_bytes();
        *points_dst = points.to_le_bytes();
        *user_market_side_dst = user_market_side.to_le_bytes();
        *outcome_dst = outcome.to_le_bytes();
        bet_type_dst[0] = bet_type.pack();
    }
}

impl Pack for SolBust {
    const LEN: usize = 73;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, SolBust::LEN];
        let (
            is_initialized,
            current_pubkey,
            previous_pubkey,
            current_multiplier,
            previous_multiplier
        ) = array_refs![src, 1, 32, 32, 4, 4];
        let is_initialized = match is_initialized {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };
        Ok(SolBust {
            is_initialized,
            current_pubkey: Pubkey::new_from_array(*current_pubkey),
            previous_pubkey: Pubkey::new_from_array(*previous_pubkey),
            current_multiplier: u32::from_le_bytes(*current_multiplier),
            previous_multiplier: u32::from_le_bytes(*previous_multiplier)
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, SolBust::LEN];
        let (
            is_initialized_dst,
            current_pubkey_dst,
            previous_pubkey_dst,
            current_multiplier_dst,
            previous_multiplier_dst,
        ) = mut_array_refs![dst, 1, 32, 32, 4, 4];

        let SolBust {
            is_initialized,
            current_pubkey,
            previous_pubkey,
            current_multiplier,
            previous_multiplier,
        } = self;

        is_initialized_dst[0] = *is_initialized as u8;
        current_pubkey_dst.copy_from_slice(current_pubkey.as_ref());
        previous_pubkey_dst.copy_from_slice(previous_pubkey.as_ref());
        *current_multiplier_dst = current_multiplier.to_le_bytes();
        *previous_multiplier_dst = previous_multiplier.to_le_bytes();
    }
}
