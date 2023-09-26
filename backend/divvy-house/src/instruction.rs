use solana_program::program_error::ProgramError;
use std::{convert::TryInto};

use crate::{
    error::ExchangeError::{self, InvalidInstruction},
};

pub enum HouseInstruction {
    Deposit {
        /// The amount party A expects to receive of token Y
        usdt_amount: u64,
        bump_seed: u8,
    },
    Withdraw {
        /// the amount the taker expects to be paid in the other token, as a u64 because that's the max possible supply of a token
        ht_amount: u64,
        bump_seed: u8,
    },
    Ownership {
        bump_seed: u8,
    },
    Freeze {
        freeze_pool: bool,
    },
    TransferLockedLiquidity {
        usdt_amount: u64,
        bump_seed: u8,
    }
}

impl HouseInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;
        Ok(match tag {
            0 => Self::Deposit {
                usdt_amount: Self::unpack_amount(rest)?,
                bump_seed: Self::unpack_last(rest)?,
            },
            1 => Self::Withdraw {
                ht_amount: Self::unpack_amount(rest)?,
                bump_seed: Self::unpack_last(rest)?,
            },
            
            2 => Self::Ownership {
                bump_seed: Self::unpack_last(rest)?,
            },
            3 => {
                let (freeze_pool, rest) = rest
                    .split_first()
                    .ok_or(ExchangeError::InvalidInstruction)?;
                Self::Freeze {
                    freeze_pool: *freeze_pool != 0,
                }
            },
            4 => Self::TransferLockedLiquidity{
                usdt_amount: Self::unpack_amount(rest)?,
                bump_seed: Self::unpack_last(rest)?,
            },
            _ => return Err(InvalidInstruction.into()),
        })
    }

    // Todo: delete these 4 methods and use split_first, like in spl-token/instruction.rs
    fn unpack_last(input: &[u8]) -> Result<u8, ProgramError> {
        let (last, _rest) = input.split_last().ok_or(InvalidInstruction)?;
        Ok(last.clone())
    }
    fn unpack_amount(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(amount)
    }
   
}
