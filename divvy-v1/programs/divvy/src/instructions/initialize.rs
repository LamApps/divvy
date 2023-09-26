use std::borrow::BorrowMut;

use anchor_lang::prelude::*;

use crate::{state::*};

#[derive(Accounts)]
pub struct Initialize<'info> {

    /// Owner account
    #[account(signer)]
    pub owner_account: AccountInfo<'info>,

    /// Bet USDC account
    #[account(mut)]
    pub bet_usdc_account: AccountInfo<'info>,

    /// Moon Shot account
    #[account(mut)]
    pub moon_shot_account: Account<'info, MoonShot>,
}


/// Pay merchant
pub fn handler(ctx: Context<Initialize>) -> ProgramResult {

    msg!("Initializing moon shot account");
    let pool_state = ctx.accounts.moon_shot_account.borrow_mut();
    pool_state.current_pubkey =  *ctx.accounts.bet_usdc_account.to_account_info().key;
    pool_state.previous_pubkey = *ctx.accounts.bet_usdc_account.to_account_info().key;
    pool_state.current_multiplier = 0;
    pool_state.previous_multiplier = 0;
    Ok(())
}