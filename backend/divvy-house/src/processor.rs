use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
};

use spl_token::{
    instruction::{burn, mint_to, transfer},
    state::Account as TokenAccount,
    state::Mint as TokenMint,
};

use crate::{
    calculate_available_liquidity,
    error::ExchangeError,
    instruction::HouseInstruction,
    schema::{authority, token_program_id},
    state::{HpLiquidity, BettingPoolState},
};

use fixed::types::U64F64;

pub struct Processor;
impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = HouseInstruction::unpack(instruction_data)?;

        match instruction {
            HouseInstruction::Deposit {
                usdt_amount,
                bump_seed,
            } => {
                msg!("Divvy - Deposit");
                Self::process_deposit(accounts, usdt_amount, bump_seed, program_id)
            }
            HouseInstruction::Withdraw {
                ht_amount,
                bump_seed,
            } => {
                msg!("Divvy - Withdraw");
                Self::process_withdraw(accounts, ht_amount, bump_seed, program_id)
            }
            HouseInstruction::Ownership { bump_seed } => {
                msg!("Divvy - Ownership");
                Self::process_ownership(accounts, bump_seed, program_id)
            }
            HouseInstruction::Freeze {
                freeze_pool,
            } => {
                msg!("Divvy - Freeze");
                Self::process_freeze(accounts, program_id, freeze_pool)
            }

            HouseInstruction::TransferLockedLiquidity { usdt_amount, bump_seed } => {
                msg!("Divvy - Transfer locked liquidity");
                Self::transfer_usdt_on_market_commence(accounts,usdt_amount, bump_seed, program_id)
            }

        }
    }

    fn process_deposit(
        accounts: &[AccountInfo],
        usdt_amount: u64,
        bump_seed: u8,
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();

        let user_account = next_account_info(accounts_iter)?;
        let ht_mint_account = next_account_info(accounts_iter)?;
        let token_program = next_account_info(accounts_iter)?;
        let user_ht_account = next_account_info(accounts_iter)?;
        let pda_account = next_account_info(accounts_iter)?;
        let user_usdt_account = next_account_info(accounts_iter)?;
        let pool_usdt_account = next_account_info(accounts_iter)?;
        let pool_state_account = next_account_info(accounts_iter)?;
        let bet_pool_account = next_account_info(accounts_iter)?;
        //TODO check if account is same as that we'll define

        msg!("- Unpacking pool state");
        let pool_state = HpLiquidity::unpack(&pool_state_account.data.borrow())?;
        msg!("- Unpacking ht mint");
        let ht_mint_state = TokenMint::unpack(&ht_mint_account.data.borrow())?;
        msg!("- Unpacking usdt pool");
        let pool_usdt_state = TokenAccount::unpack(&pool_usdt_account.data.borrow())?;
        msg!("- Unpacking bet pool");
        let bet_pool_state = BettingPoolState::unpack(&bet_pool_account.data.borrow())?;


        // Checking house token ownership
        if *ht_mint_account.key != pool_state.ht_mint {
            return Err(ExchangeError::InvalidHtMintAccount.into());
        }
        if *pool_usdt_account.key != pool_state.pool_usdt {
            return Err(ExchangeError::InvalidPoolUsdtAccount.into());
        }
        if *token_program.key != token_program_id::ID {
            return Err(ExchangeError::InvalidInstruction.into());
        }

        msg!("- USDT amount deposited");
        msg!(0, 0, 0, 0, usdt_amount);
        msg!("- HT supply in circulation");
        msg!(0, 0, 0, 0, ht_mint_state.supply);
        msg!("- House pool balance");
        msg!(0, 0, 0, 0, pool_usdt_state.amount);

        msg!("- Bet pool locked liquidity");
        msg!(0, 0, 0, 0, bet_pool_state.locked_liquidity);
        msg!("- Bet pool live liquidity");
        msg!(0, 0, 0, 0, bet_pool_state.live_liquidity);

        if bet_pool_state.live_liquidity > 0 {
            return Err(ExchangeError::GamesAreLive.into());
        }

        if pool_state.frozen_pool {
            return Err(ExchangeError::PoolFrozen.into());
        }
        // TODO Add checked math 
        let ht_amount = match ht_mint_state.supply {
            0 => usdt_amount,
            _ => (U64F64::from_num(ht_mint_state.supply)
                .checked_div(U64F64::from_num(
                    pool_usdt_state
                        .amount + bet_pool_state.locked_liquidity + bet_pool_state.live_liquidity
                ))
                .ok_or(ExchangeError::AmountOverflow)?
                .checked_mul(U64F64::from_num(usdt_amount))
                .ok_or(ExchangeError::AmountOverflow)?)
            .to_num(),
        };

        msg!("- HT amount received");
        msg!(0, 0, 0, 0, ht_amount);

        let transfer_instruction = transfer(
            token_program.key,
            &user_usdt_account.key,
            &pool_usdt_account.key,
            &user_account.key,
            &[&user_account.key],
            usdt_amount.clone(),
        )?;
        msg!("Calling the token program to transfer tokens...");
        invoke(
            &transfer_instruction,
            &[
                user_usdt_account.clone(),
                pool_usdt_account.clone(),
                user_account.clone(),
                token_program.clone(),
            ],
        )?;

        msg!("Creating mint instruction");
        let mint_ix = mint_to(
            &token_program.key,
            &ht_mint_account.key,
            &user_ht_account.key,
            &pda_account.key,
            &[&pda_account.key],
            ht_amount,
        )?;

        invoke_signed(
            &mint_ix,
            &[
                ht_mint_account.clone(),
                user_ht_account.clone(),
                pda_account.clone(),
            ],
            &[&[b"divvyhouse", &[bump_seed]]],
        )?;

        Ok(())
    }

    fn process_withdraw(
        accounts: &[AccountInfo],
        ht_amount: u64,
        bump_seed: u8,
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();

        let user_account = next_account_info(accounts_iter)?;
        let ht_mint_account = next_account_info(accounts_iter)?;
        let token_program = next_account_info(accounts_iter)?;
        let user_ht_account = next_account_info(accounts_iter)?;
        let pda_account = next_account_info(accounts_iter)?;
        let user_usdt_account = next_account_info(accounts_iter)?;
        let pool_usdt_account = next_account_info(accounts_iter)?;
        let pool_state_account = next_account_info(accounts_iter)?;
        let bet_pool_account = next_account_info(accounts_iter)?;
        //TODO check if account is same as that we'll define

        let pool_state = HpLiquidity::unpack(&pool_state_account.data.borrow())?;
        let ht_mint_state = TokenMint::unpack(&ht_mint_account.data.borrow())?;
        let pool_usdt_state = TokenAccount::unpack(&pool_usdt_account.data.borrow())?;
        let bet_pool_state = BettingPoolState::unpack(&bet_pool_account.data.borrow())?;

        // Checking house token ownership
        if *ht_mint_account.key != pool_state.ht_mint {
            return Err(ExchangeError::InvalidHtMintAccount.into());
        }
        if *pool_usdt_account.key != pool_state.pool_usdt {
            return Err(ExchangeError::InvalidPoolUsdtAccount.into());
        }
        if *token_program.key != token_program_id::ID {
            return Err(ExchangeError::InvalidInstruction.into());
        }

        msg!("- HT amount burned");
        msg!(0, 0, 0, 0, ht_amount);
        msg!("- HT supply in circulation");
        msg!(0, 0, 0, 0, ht_mint_state.supply);
        msg!("- House pool balance");
        msg!(0, 0, 0, 0, pool_usdt_state.amount);
        msg!("- Bet pool locked liquidity");
        msg!(0, 0, 0, 0, bet_pool_state.locked_liquidity);
        msg!("- Bet pool live liquidity");
        msg!(0, 0, 0, 0, bet_pool_state.live_liquidity);

        if bet_pool_state.live_liquidity > 0 {
            return Err(ExchangeError::GamesAreLive.into());
        }
        if pool_state.frozen_pool {
            return Err(ExchangeError::PoolFrozen.into());
        }

        let usdt_amount: u64 = (U64F64::from_num(
            pool_usdt_state
                .amount + bet_pool_state.locked_liquidity + bet_pool_state.live_liquidity
        )
        .checked_div(U64F64::from_num(ht_mint_state.supply))
        .ok_or(ExchangeError::AmountOverflow)?
        .checked_mul(U64F64::from_num(ht_amount))
        .ok_or(ExchangeError::AmountOverflow)?)
        .to_num();
        let available_liquidity = calculate_available_liquidity(&pool_usdt_state, &bet_pool_state)?;

        msg!("- House pool available liquidity");
        msg!(0, 0, 0, 0, available_liquidity);
        msg!("- USDT amount received");
        msg!(0, 0, 0, 0, usdt_amount);

        if usdt_amount > available_liquidity {
            return Err(ExchangeError::NotEnoughAvailableLiquidityForWithdrawal.into());
        }

        msg!("Burning HT");
        let burn_tx = burn(
            &token_program.key,
            &user_ht_account.key,
            &ht_mint_account.key,
            &user_account.key,
            &[&user_account.key],
            ht_amount,
        )?;

        invoke(
            &burn_tx,
            &[
                token_program.clone(),
                user_ht_account.clone(),
                ht_mint_account.clone(),
                user_account.clone(),
            ],
        )?;

        msg!("Transfering USDT to the user");
        let transfer_instruction = transfer(
            &token_program.key,
            &pool_usdt_account.key,
            &user_usdt_account.key,
            &pda_account.key,
            &[&pda_account.key],
            usdt_amount.clone(),
        )?;
        invoke_signed(
            &transfer_instruction,
            &[
                pool_usdt_account.clone(),
                user_usdt_account.clone(),
                pda_account.clone(),
                token_program.clone(),
            ],
            &[&[b"divvyhouse", &[bump_seed]]],
        )?;

        Ok(())
    }


    pub fn transfer_usdt_on_market_commence(
        accounts: &[AccountInfo],
        usdt_amount: u64,
        bump_seed: u8,
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let token_program = next_account_info(accounts_iter)?;
        let pda_account = next_account_info(accounts_iter)?;
        let bet_pda_account = next_account_info(accounts_iter)?;
        let betting_usdt_account = next_account_info(accounts_iter)?;
        let pool_usdt_account = next_account_info(accounts_iter)?;
        let pool_state_account = next_account_info(accounts_iter)?;

        if !bet_pda_account.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        // let pool_usdt_state = TokenAccount::unpack(&pool_usdt_account.data.borrow())?;
        // let pool_state = HpLiquidity::unpack(&pool_state_account.data.borrow())?;

        //TODO check if locked liquidity is greater than the usdt balance 
        //TODO check if betting_usdt_account is actually the betting_account in state

        msg!("transferring locked liquidity usdt on market commence");
        let transfer_instruction = transfer(
            &token_program.key,
            &pool_usdt_account.key,
            &betting_usdt_account.key,
            &pda_account.key,
            &[&pda_account.key],
            usdt_amount.clone(),
        )?;
        invoke_signed(
            &transfer_instruction,
            &[
                pool_usdt_account.clone(),
                betting_usdt_account.clone(),
                pda_account.clone(),
                token_program.clone(),
            ],
            &[&[b"divvyhouse", &[bump_seed]]],
        )?;

        Ok(())
    }
    

    pub fn process_ownership(
        accounts: &[AccountInfo],
        _bump_seed: u8,
        _program_id: &Pubkey,
    ) -> ProgramResult {
        msg!("Divvy program ownership");
        let accounts_iter = &mut accounts.iter();
        let initializer = next_account_info(accounts_iter)?;
        let pool_state_account = next_account_info(accounts_iter)?;
        let ht_mint_account = next_account_info(accounts_iter)?;
        let betting_usdt_account = next_account_info(accounts_iter)?;
        let pool_usdt_account = next_account_info(accounts_iter)?;
        msg!("Unpack HP State account");
        let mut pool_state = HpLiquidity::unpack_unchecked(&pool_state_account.data.borrow())?;
        msg!("Check HP State Init");
        // Doesn't help, should change
        // if pool_state.is_initialized {
        //     return Err(ExchangeError::HpLiquidityAlreadyInitialized.into());
        // }
        msg!("Check Rent Exemption");
        if !Rent::get()?.is_exempt(
            **pool_state_account.lamports.borrow(),
            pool_state_account.data_len(),
        ) {
            return Err(ProgramError::AccountNotRentExempt);
        }
        // Unpack token accounts to verify their length
        msg!("Check token account accounts length");
        TokenMint::unpack(&ht_mint_account.data.borrow())?;
        TokenAccount::unpack(&betting_usdt_account.data.borrow())?;
        TokenAccount::unpack(&pool_usdt_account.data.borrow())?;

        msg!("Check authority");
        if initializer.key != &authority::ID {
            return Err(ExchangeError::NotValidAuthority.into());
        }

        msg!("Initalizing HP State account");
        pool_state = HpLiquidity {
            is_initialized: true,
            ht_mint: *ht_mint_account.key,
            betting_usdt: *betting_usdt_account.key,
            pool_usdt: *pool_usdt_account.key,
            frozen_pool: false,
        };
        HpLiquidity::pack(pool_state, &mut pool_state_account.data.borrow_mut())?;
        Ok(())
    }

    pub fn process_freeze(
        accounts: &[AccountInfo],
        _program_id: &Pubkey,
        freeze_pool: bool,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let initializer = next_account_info(accounts_iter)?;
        let pool_state_account = next_account_info(accounts_iter)?;

        if !initializer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        if initializer.key != &authority::ID {
            return Err(ExchangeError::NotValidAuthority.into());
        }

        let mut pool_state = HpLiquidity::unpack(&pool_state_account.data.borrow())?;

        if freeze_pool && !pool_state.frozen_pool {
            msg!("Freezing pool");
        } else if !freeze_pool && pool_state.frozen_pool {
            msg!("Unfreezing pool");
        }

        pool_state.frozen_pool = freeze_pool;

        HpLiquidity::pack(pool_state, &mut pool_state_account.data.borrow_mut())?;

        Ok(())
    }
}
