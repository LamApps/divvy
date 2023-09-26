use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer};

use crate::{errors::ErrorCode, state::{MoonShootBet, Multiplier}, utils::calculate_moon_shot_payout};

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct SettleMoonShotBet<'info> {

    /// The user that is paying the merchant
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

    #[account(mut)]
    pub pda_account: Account<'info, Multiplier>,

    #[account(address = token::ID)]
    pub token_program: AccountInfo<'info>,
}

impl<'info> SettleMoonShotBet<'info> {
    fn transfer_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.clone(),
            Transfer {
                from: self.bet_usdt_account.to_account_info(),
                to: self.user_usdt_account.to_account_info(),
                authority: self.pda_account.to_account_info(),
            },
        )
    }
}

/// Pay merchant
pub fn handler(ctx: Context<SettleMoonShotBet>) -> ProgramResult {

    let moon_shot_bet_state = &ctx.accounts.moon_shot_bet_account;
    let multiplier_state = &ctx.accounts.multiplier_account;
    
    if moon_shot_bet_state.user_multiplier <= multiplier_state.multiplier {
        let payout = calculate_moon_shot_payout(moon_shot_bet_state.risk, moon_shot_bet_state.user_multiplier).ok_or(ErrorCode::InvalidMoonShotPayout)?;

        msg!("User won, Transferring payout from divvy account to user account");
        token::transfer(ctx.accounts.transfer_context(), payout)?;
    }
    Ok(())
}