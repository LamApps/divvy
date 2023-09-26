use num_derive::FromPrimitive as DeriveFromPrimitive;
use num_traits::FromPrimitive as TraitsFromPrimitive;
use solana_program::{
    decode_error::DecodeError,
    msg,
    program_error::{PrintProgramError, ProgramError},
};
use thiserror::Error;

#[derive(Error, Debug, Copy, Clone, DeriveFromPrimitive, PartialEq, Eq)]
pub enum ExchangeError {
    /// Invalid instruction
    #[error("Invalid Instruction")]
    InvalidInstruction,
    /// Not Valid Authority
    #[error("Not Valid Authority")]
    NotValidAuthority,
    /// Expected Amount Mismatch
    #[error("Expected Amount Mismatch")]
    ExpectedAmountMismatch,
    /// Expected Data Mismatch
    #[error("Expected Data Mismatch")]
    ExpectedDataMismatch,
    /// Amount Overflow
    #[error("Amount Overflow")]
    AmountOverflow,
    /// Invalid feed account
    #[error("Invalid feed account")]
    InvalidFeedAccount,
    #[error("Invalid house token mint account")]
    InvalidHtMintAccount,
    #[error("Invalid house pool USDT account")]
    InvalidPoolUsdtAccount,
    #[error("Invalid market account")]
    InvalidMarketAccount,
    #[error("Invalid insurance fund USDT account")]
    InvalidInsuranceFundUsdtAccount,
    #[error("Invalid divvy foundation USDT account")]
    InvalidDivvyFoundationUsdtAccount,

    // Deposit withdraw errors
    #[error("Not enough available liquidity for withdrawal")]
    NotEnoughAvailableLiquidityForWithdrawal,
    #[error("Can not use the house pool when there are bets placed on live games")]
    GamesAreLive,
    #[error("Pool is frozen")]
    PoolFrozen,

    // Betting errors
    #[error("Betting is frozen")]
    BettingFrozen,

    // Already settled errors
    #[error("Market already settled")]
    MarketAlreadySettled,
    #[error("Market not settled")]
    MarketNotSettled,
    #[error("Bet already settled")]
    BetAlreadySettled,

    // Betting init errors
    #[error("Not enough available liquidity for bet")]
    NotEnoughAvailableLiquidityForBet,
    #[error("Bet risk is zero")]
    BetRiskZero,

    // Market settlement errors
    #[error("Feed result not valid when settling market")]
    NotValidMarketResult,

    // Market commence errors
    #[error("Market has already commenced")]
    MarketCommenced,

    // Initialized errors
    #[error("HP liquidity not initialized")]
    HpLiquidityNotInitialized,
    #[error("HP liquidity already initialized")]
    HpLiquidityAlreadyInitialized,
    #[error("Market not initialized")]
    MarketNotInitialized,
    #[error("Market already initialized")]
    MarketAlreadyInitialized,
    #[error("Bet already initialized")]
    BetAlreadyInitialized,
    #[error("Feed not initialized")]
    FeedNotInitialized,

    // Assertion errors
    #[error("Market side risk underflow.")]
    MarketSideRiskUnderflow,
    #[error("Market side payout underflow.")]
    MarketSidePayoutUnderflow,
    #[error("All bets in market settled and market side risk is positive.")]
    MarketSideRiskRemaining,
    #[error("All bets in market settled and market side payout is positive.")]
    MarketSidePayoutRemaining,
    #[error("All bets in market settled and market bettor balance is positive.")]
    MarketBettorBalanceRemaining,
    #[error("All bets settled and house pool bettor balance is positive.")]
    HousePoolBettorBalanceRemaining,
    #[error("All bets settled and the locked liquidity in the house pool is positive.")]
    HousePoolLockedLiquidityRemaining,
    #[error("All bets settled and the live liquidity in the house pool is positive.")]
    HousePoolLiveLiquidityRemaining,
}

impl PrintProgramError for ExchangeError {
    fn print<E>(&self)
    where
        E: 'static + std::error::Error + DecodeError<E> + PrintProgramError + TraitsFromPrimitive,
    {
        match self {
            ExchangeError::InvalidInstruction => msg!("Invalid Instruction"),
            ExchangeError::NotValidAuthority => msg!("Not Valid Authority"),
            ExchangeError::ExpectedAmountMismatch => msg!("Expected Amount Mismatch"),
            ExchangeError::ExpectedDataMismatch => msg!("Expected Data Mismatch"),
            ExchangeError::AmountOverflow => msg!("Amount Overflow"),
            ExchangeError::InvalidFeedAccount => msg!("Invalid feed account"),
            ExchangeError::InvalidHtMintAccount => msg!("Invalid house token mint account"),
            ExchangeError::InvalidPoolUsdtAccount => msg!("Invalid house pool USDT account"),
            ExchangeError::InvalidMarketAccount => msg!("Invalid market account"),
            ExchangeError::InvalidInsuranceFundUsdtAccount => {
                msg!("Invalid insurance fund USDT account")
            }
            ExchangeError::InvalidDivvyFoundationUsdtAccount => {
                msg!("Invalid divvy foundation USDT account")
            }

            // Deposit withdraw errors
            ExchangeError::NotEnoughAvailableLiquidityForWithdrawal => {
                msg!("Not enough available liquidity for withdrawal")
            }
            ExchangeError::GamesAreLive => {
                msg!("Can not use the house pool when there are bets placed on live games")
            }
            ExchangeError::PoolFrozen => msg!("Pool is frozen"),

            // Betting errors
            ExchangeError::BettingFrozen => msg!("Betting is frozen"),

            // Settled errors
            ExchangeError::MarketAlreadySettled => msg!("Market already settled"),
            ExchangeError::MarketNotSettled => msg!("Market not settled"),
            ExchangeError::BetAlreadySettled => msg!("Bet already settled"),

            // Betting init errors
            ExchangeError::NotEnoughAvailableLiquidityForBet => {
                msg!("Not enough available liquidity for bet")
            }
            ExchangeError::BetRiskZero => msg!("Bet risk is zero"),

            // Market settlement errors
            ExchangeError::NotValidMarketResult => {
                msg!("Feed result not valid when settling market")
            }

            // Market commence errors
            ExchangeError::MarketCommenced => msg!("Market has already commenced"),

            // Initialized errors
            ExchangeError::HpLiquidityNotInitialized => {
                msg!("HP liquidity not initialized");
            }
            ExchangeError::HpLiquidityAlreadyInitialized => {
                msg!("HP liquidity already initialized")
            }
            ExchangeError::MarketNotInitialized => msg!("Market not initialized"),
            ExchangeError::MarketAlreadyInitialized => msg!("Market already initialized"),
            ExchangeError::BetAlreadyInitialized => msg!("Bet already initialized"),
            ExchangeError::FeedNotInitialized => msg!("Feed not initialized"),

            // Assertion errors
            ExchangeError::MarketSideRiskUnderflow => msg!("Market side risk underflow."),
            ExchangeError::MarketSidePayoutUnderflow => msg!("Market side payout underflow."),
            ExchangeError::MarketSideRiskRemaining => {
                msg!("All bets in market settled and market side risk is positive.")
            }
            ExchangeError::MarketSidePayoutRemaining => {
                msg!("All bets in market settled and market side payout is positive.")
            }
            ExchangeError::MarketBettorBalanceRemaining => {
                msg!("All bets in market settled and market bettor balance is positive.")
            }
            ExchangeError::HousePoolBettorBalanceRemaining => {
                msg!("All bets settled and house pool bettor balance is positive.")
            }
            ExchangeError::HousePoolLockedLiquidityRemaining => {
                msg!("The balance in the house pool does not equal available liquidity.")
            }
            ExchangeError::HousePoolLiveLiquidityRemaining => {
                msg!("All bets settled and the live liquidity in the house pool is positive.")
            }
        }
    }
}

impl From<ExchangeError> for ProgramError {
    fn from(e: ExchangeError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
impl<T> DecodeError<T> for ExchangeError {
    fn type_of() -> &'static str {
        "ExchangeError"
    }
}
