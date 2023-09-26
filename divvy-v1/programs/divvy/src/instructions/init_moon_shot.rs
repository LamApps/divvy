use std::borrow::BorrowMut;

use anchor_lang::prelude::*;
use anchor_spl::token::{self};

use crate::{state::*};

#[derive(Accounts)]
pub struct InitMoonShot<'info> {

    #[account(signer)]
    pub owner_account: AccountInfo<'info>,

    /// The user that is paying the merchant
    #[account(signer)]
    pub moon_shot_account: Account<'info, MoonShot>,
    /// The merchant account to receive the tokens to
    #[account(mut)]
    pub current_multiplier_account: Account<'info, Multiplier>,

    #[account(mut)]
    pub previous_multiplier_account: Account<'info, Multiplier>,

    #[account(address = token::ID)]
    pub token_program: AccountInfo<'info>,
}

impl<'info> InitMoonShot<'info> {

}

/// Pay merchant
pub fn handler(ctx: Context<InitMoonShot>, multiplier: u32) -> ProgramResult {


        // Add check here to check that the bust account is same as the one which we'll use when we do deployment
        let previous_mul_state = ctx.accounts.previous_multiplier_account.borrow_mut();
        let bust_state = ctx.accounts.moon_shot_account.borrow_mut();

        previous_mul_state.busted = true;
        previous_mul_state.multiplier = multiplier;

        bust_state.current_pubkey = *ctx.accounts.current_multiplier_account.to_account_info().key;
        bust_state.previous_pubkey = *ctx.accounts.previous_multiplier_account.to_account_info().key;
        bust_state.previous_multiplier = bust_state.current_multiplier;
        bust_state.current_multiplier = 0;
        
        Ok(())
}