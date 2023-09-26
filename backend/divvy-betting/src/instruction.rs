use solana_program::program_error::ProgramError;
use std::convert::TryInto;

use crate::{
    error::ExchangeError::{self, InvalidInstruction},
    state::BetType,
};

pub enum ExchangeInstruction {
    Initbet {
        risk: u64,
        odds: u64,
        points: u16,
        market_side: u8,
        bet_type: BetType,
        bump_seed: u8
    },
    SettleBet {
        bump_seed: u8,
    },
    SettlePNL {
        bump_seed: u8,
    },
    InitMarket {
        bump_seed: u8
    },
    InitFuturesMarket {
        bump_seed: u8
    },
    SettleMarket {
        bump_seed: u8,
    },
    Ownership {
        bump_seed: u8,
    },
    CommenceMarket {
        bump_seed: u8
    },
    Freeze {
        freeze_betting: bool,
    },
    InitBust {
        multiplier: u32,
    },
    InitBustBet {
        multiplier: u32,
        risk: u16,
    },
    SettleBustBet {}
}

impl ExchangeInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;
        Ok(match tag {
            0 => { 
                    Self::Initbet {
                        risk: Self::unpack_amount(rest)?,
                        odds: Self::unpack_odds(rest)?,
                        points: Self::unpack_points(rest)?,
                        market_side: Self::unpack_market_side(rest)?,
                        bet_type: BetType::unpack(&rest[19])?,
                        bump_seed: Self::unpack_last(rest)?,
                    }
            }
            1 => Self::SettleBet {
                bump_seed: Self::unpack_last(rest)?,
            },
            2 => {
                Self::InitMarket {
                    bump_seed: Self::unpack_last(rest)?,
                }
            }
            3 => Self::SettleMarket {
                bump_seed: Self::unpack_last(rest)?,
            },
            4 => Self::Ownership {
                bump_seed: Self::unpack_last(rest)?,
            },
            5 => Self::CommenceMarket {
                bump_seed: Self::unpack_last(rest)?,
            },
            6 => {
                let (freeze_betting, _rest) = rest
                    .split_first()
                    .ok_or(ExchangeError::InvalidInstruction)?;
                Self::Freeze {
                    freeze_betting: *freeze_betting != 0,
                }
            },
            7 => Self::SettlePNL {
                bump_seed: Self::unpack_last(rest)?,
            },
            8 => Self::InitFuturesMarket {
                bump_seed: Self::unpack_last(rest)?,
            },
            9 => Self::InitBust {
                multiplier: Self::unpack_multiplier(rest)?,
            },
            10 => Self::InitBustBet {
                multiplier: Self::unpack_multiplier(rest)?,
                risk: Self::unpack_bust_risk(rest)?,
            },
            11 => Self::SettleBustBet {
            },
            _ => return Err(InvalidInstruction.into()),
        })
    }

    // Todo: delete these 4 methods and use split_first, like in spl-token/instruction.rs
    fn unpack_last(input: &[u8]) -> Result<u8, ProgramError> {
        let (last, _rest) = input.split_last().ok_or(InvalidInstruction)?;
        Ok(last.clone())
    }

    fn unpack_multiplier(input: &[u8]) -> Result<u32, ProgramError> {
        let amount = input
            .get(..4)
            .and_then(|slice| slice.try_into().ok())
            .map(u32::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(amount)
    }
    

    fn unpack_bust_risk(input: &[u8]) -> Result<u16, ProgramError> {
        let amount = input
            .get(5..6)
            .and_then(|slice| slice.try_into().ok())
            .map(u16::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(amount)
    }

    fn unpack_amount(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(amount)
    }
    fn unpack_odds(input: &[u8]) -> Result<u64, ProgramError> {
        let odds = input
            .get(8..16)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(odds)
    }
    fn unpack_points(input: &[u8]) -> Result<u16, ProgramError> {
        let points = input
            .get(16..18)
            .and_then(|slice| slice.try_into().ok())
            .map(u16::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(points)
    }
    fn unpack_market_side(input: &[u8]) -> Result<u8, ProgramError> {
        let market_side = input
            .get(18..19)
            .and_then(|slice| slice.try_into().ok())
            .map(u8::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(market_side)
    }
}
