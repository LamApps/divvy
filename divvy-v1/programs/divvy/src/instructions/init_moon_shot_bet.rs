use std::borrow::{BorrowMut};

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer};

use crate::{state::*};

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct InitMoonShotBet<'info> {

    /// The user that is paying the merchant
    #[account(signer)]
    pub moon_shot_account: Account<'info, MoonShootBet>,

    #[account(signer)]
    pub moon_shot_bet_account: Account<'info, MoonShootBet>,

    #[account(signer)]
    pub user_account: AccountInfo<'info>,

    #[account(mut)]
    pub user_usdt_account: AccountInfo<'info>,

    /// The token account with the tokens to be deposited
    #[account(mut)]
    pub bet_usdt_account: AccountInfo<'info>,

    /// The merchant account to receive the tokens to
    #[account(mut)]
    pub multiplier_account: Account<'info, Multiplier>,

    #[account(address = token::ID)]
    pub token_program: AccountInfo<'info>,
}

impl<'info> InitMoonShotBet<'info> {
    fn transfer_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.clone(),
            Transfer {
                from: self.user_usdt_account.to_account_info(),
                to: self.bet_usdt_account.to_account_info(),
                authority: self.user_account.clone(),
            },
        )
    }
}

/// Pay merchant
pub fn handler(ctx: Context<InitMoonShotBet>, risk: u16, multiplier: u32) -> ProgramResult {

    let bust_state = ctx.accounts.moon_shot_account.borrow_mut();
    let multiplier_state = ctx.accounts.multiplier_account.borrow_mut();
    // Check to confirm it's the same account

    // Check to confirm multipliers

    bust_state.user_main_pubkey = *ctx.accounts.user_account.to_account_info().key;
    bust_state.user_usdt_pubkey = *ctx.accounts.user_usdt_account.to_account_info().key;
    bust_state.risk = risk;
    bust_state.user_multiplier = multiplier;
    bust_state.actual_multiplier_pubkey = bust_state.actual_multiplier_pubkey;

    multiplier_state.counter = multiplier_state.counter + 1;

    msg!("Transferring risk from user account to divvy account");
    token::transfer(ctx.accounts.transfer_context(), risk.into())?;

    Ok(())
}