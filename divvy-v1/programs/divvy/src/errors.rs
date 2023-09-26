use anchor_lang::error;

#[error]
pub enum ErrorCode {
    #[msg("failed to perform some math operation safely")]
    ArithmeticError,

    #[msg("There was an error calculating your moonshot payout")]
    InvalidMoonShotPayout,
}
