use anchor_lang::prelude::*;

pub mod errors;
mod instructions;
pub mod state;
pub mod utils;

use instructions::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod divvy {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        instructions::initialize::handler(ctx)
    }

    pub fn init_moon_shot(ctx: Context<InitMoonShot>, multiplier: u32) -> ProgramResult {
        instructions::init_moon_shot::handler(ctx, multiplier)
    }

    pub fn init_shot_bet(ctx: Context<InitMoonShotBet>, risk: u16, multiplier: u32) -> ProgramResult {
        instructions::init_moon_shot_bet::handler(ctx, risk , multiplier)
    }

    pub fn settle_shot_bet(ctx: Context<SettleMoonShotBet>) -> ProgramResult {
        instructions::settle_moon_shot_bet::handler(ctx)
    }
}