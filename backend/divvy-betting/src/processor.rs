use std::mem::size_of;

use solana_program::{
    account_info::{next_account_info, AccountInfo}, 
    entrypoint::ProgramResult, 
    instruction::{AccountMeta, Instruction}, 
    msg, 
    program::{invoke, invoke_signed}, 
    program_error::ProgramError, 
    program_pack::Pack, 
    pubkey::Pubkey, 
    rent::Rent, 
    sysvar::Sysvar
};

use spl_token::{
    instruction::{transfer},
    state::Account as TokenAccount,
};

//Switchboard dependencies
use switchboard_program::{
    get_aggregator, 
    get_aggregator_result, 
    AggregatorState, 
    RoundResult
};

use crate::{
    calculate_available_liquidity, 
    calculate_bust_payout, 
    calculate_locked_liquidity, 
    calculate_payout, 
    error::ExchangeError, 
    get_bet_outcome, 
    instruction::ExchangeInstruction, 
    schema::{
        authority, 
        divvy_house_program_id, 
        token_program_id
    }, 
    state::{
        Bet, 
        BetType, 
        BettingPoolState, 
        BustBet, 
        Market, 
        MarketOutcome, 
        MarketSide, 
        Multiplier, 
        SolBust
    }
};

use fixed::types::U64F64;

pub struct Processor;
impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = ExchangeInstruction::unpack(instruction_data)?;

        match instruction {
            ExchangeInstruction::Initbet {
                risk,
                odds,
                points,
                market_side,
                bet_type, 
                bump_seed
            } => {
                msg!("Divvy - Init Bet");
                Self::process_init_bet(accounts, risk, odds, points, market_side, bet_type, bump_seed, program_id)
            }
            ExchangeInstruction::SettleBet { bump_seed } => {
                msg!("Divvy - Settle Bet");
                Self::process_settle_bet(accounts, bump_seed, program_id)
            }
            ExchangeInstruction::SettlePNL { bump_seed } => {
                msg!("Divvy - Settle Profit Loss");
                Self::process_settle_pnl(accounts, bump_seed, program_id)
            }
            ExchangeInstruction::InitMarket { bump_seed } => {
                msg!("Divvy - Init Market");
                Self::process_init_market(accounts, bump_seed, program_id)
            }
            ExchangeInstruction::InitFuturesMarket { bump_seed } => {
                msg!("Divvy - Init Futures Market");
                Self::process_init_futures_market(accounts, bump_seed, program_id)
            }
            ExchangeInstruction::SettleMarket { bump_seed } => {
                msg!("Divvy - Settle Moneyline Market");
                Self::process_settle_market(accounts, bump_seed)
            }
            ExchangeInstruction::Ownership { bump_seed } => {
                msg!("Divvy - Ownership");
                Self::process_ownership(accounts, bump_seed, program_id)
            }
            ExchangeInstruction::CommenceMarket {bump_seed} => {
                msg!("Divvy - Commence Market");
                Self::process_commence_market(accounts, bump_seed, program_id)
            }
            ExchangeInstruction::Freeze {
                freeze_betting,
            } => {
                msg!("Divvy - Freeze");
                Self::process_freeze(accounts, program_id, freeze_betting)
            }
            ExchangeInstruction::InitBust {multiplier} => {
                msg!("Divvy - Init Bust");
                Self::process_init_new_bust(accounts, multiplier, program_id)
            }
            ExchangeInstruction::InitBustBet {risk, multiplier} => {
                msg!("Divvy - Init Bust Bet");
                Self::process_init_bust_bet(accounts, program_id, risk, multiplier)
            }
            ExchangeInstruction::SettleBustBet {} => {
                msg!("Divvy - Settle Bust Bet");
                Self::process_settle_bust_bet(accounts, program_id)
            }
        }
    }

    fn process_init_bet(
        accounts: &[AccountInfo],
        risk: u64,
        _odds: u64,
        points: u16,
        market_side: u8,
        bet_type: BetType,
        bump_seed: u8,
        program_id: &Pubkey,
    ) -> ProgramResult {
        msg!("- Risk");
        msg!(0, 0, 0, 0, risk);
        msg!("- Bet Type");
        msg!(0, 0, 0, 0, bet_type);

        let accounts_iter = &mut accounts.iter();
        let initializer = next_account_info(accounts_iter)?;
        if !initializer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        let feed_account = next_account_info(accounts_iter)?;
        let bet_account = next_account_info(accounts_iter)?;
        let market_state_account = next_account_info(accounts_iter)?;
        let bet_pool_state_account = next_account_info(accounts_iter)?;
        let hp_usdt_account = next_account_info(accounts_iter)?;
        let bet_usdt_account = next_account_info(accounts_iter)?;
        let user_usdt_account = next_account_info(accounts_iter)?;
        let token_program = next_account_info(accounts_iter)?;
        let pda_account = next_account_info(accounts_iter)?;
        let bet_pda_account = next_account_info(accounts_iter)?;
        let pool_state_account = next_account_info(accounts_iter)?;
        let divvy_hp_program = next_account_info(accounts_iter)?;
        msg!("Validating accounts");
        //Checking if market is initialized
        msg!("Checking market initialization");
        let mut market_state = Market::unpack(&market_state_account.data.borrow())
            .map_err(|_| Into::<ProgramError>::into(ExchangeError::MarketNotInitialized))?;
        msg!("Checking pool state initialization");
        let mut pool_state = BettingPoolState::unpack(&bet_pool_state_account.data.borrow())
            .map_err(|_| Into::<ProgramError>::into(ExchangeError::BettingPoolStateNotInitialized))?;
        msg!("Checking bet state initialization");
        let mut bet_state = Bet::unpack_unchecked(&bet_account.data.borrow())?;
        if bet_state.is_initialized {
            return Err(ExchangeError::BetAlreadyInitialized.into());
        }
        msg!("Checking rent exemption");
        if !Rent::get()?.is_exempt(**bet_account.lamports.borrow(), bet_account.data_len()) {
            return Err(ProgramError::AccountNotRentExempt);
        }
        msg!("Unpack House Pool USDC account");
        let hp_usdt_state = TokenAccount::unpack(&hp_usdt_account.data.borrow())?;

        msg!("Checking house pool usdt account");
        if *hp_usdt_account.key != pool_state.house_pool_usdt {
            return Err(ExchangeError::InvalidHousePoolUsdtAccount.into());
        }

        msg!("Checking bet pool usdt account");
        if *bet_usdt_account.key != pool_state.betting_pool_usdt {
            return Err(ExchangeError::InvalidBettingPoolUsdtAccount.into());
        }

        msg!("Checking Market state account ownership");
        if *market_state_account.owner != *program_id {
            return Err(ExchangeError::InvalidMarketAccount.into());
        }

        msg!("Checking Token program account ownership");
        if *token_program.key != token_program_id::ID {
            return Err(ExchangeError::InvalidInstruction.into());
        }

        msg!("Checking if betting is frozen");
        if pool_state.frozen_betting {
            return Err(ExchangeError::BettingFrozen.into());
        }

        msg!("Checking if market is not commenced or settled yet");
        if market_state.result != MarketOutcome::NotYetCommenced {
            return Err(ExchangeError::MarketCommenced.into());
        }
        //TODO fix this
        //Checking if feed account is right
        // if market_state.market_sides[market_side as usize]
        //     .odds_feed_account
        //     .ok_or(ExchangeError::InvalidInstruction)?
        //     != *feed_account.key
        // {
        //     return Err(ExchangeError::InvalidFeedAccount.into());
        // }

        msg!("Checking if risk is non zero");
        if risk == 0 {
            return Err(ExchangeError::BetRiskZero.into());
        }

        let available_liquidty = calculate_available_liquidity(&hp_usdt_state, &pool_state)?;


        msg!("Getting odds from the Switchboard");
        let aggregator: AggregatorState = get_aggregator(feed_account)?;
        let round_result: RoundResult = get_aggregator_result(&aggregator)?;
        let feed_odds = round_result
            .result
            .ok_or(ExchangeError::FeedNotInitialized)?;
        if feed_odds >= 0f64 {
            msg!("- Odds from feed: Positive:");
            msg!(0, 0, 0, 0, feed_odds as u64);
        } else {
            msg!("- Odds from feed: Negative:");
            msg!(0, 0, 0, 0, -feed_odds as u64);
        }

        //TODO comparison of provided odds & feed odds.

        //Calculate payout
        let payout = calculate_payout(feed_odds, risk).ok_or(ExchangeError::InvalidInstruction)?;
        msg!("- Bet payout");
        msg!(0, 0, 0, 0, payout);

        if payout > available_liquidty {
            return Err(ExchangeError::NotEnoughAvailableLiquidityForBet.into());
        }
        // Payout coming out as zero, throw error
        if payout == 0u64  {
            return Err(ExchangeError::PayoutZero.into());
        }
        // Increment pending bets
        msg!("Incrementing market pending bets.");
        market_state.pending_bets = market_state
            .pending_bets
            .checked_add(1)
            .ok_or(ExchangeError::AmountOverflow)?;

        msg!("Incrementing house pool pending bets.");
        pool_state.pending_bets = pool_state
            .pending_bets
            .checked_add(1)
            .ok_or(ExchangeError::AmountOverflow)?;

        //Calculating locked liquidity
        let new_locked_liquidity;
        if bet_type == BetType::MoneyLine {
            //Add risk & payout in market side
            let current_market_side_risk = market_state.market_sides[market_side as usize].risk;
            let current_market_side_payout = market_state.market_sides[market_side as usize].payout;
            let old_locked_liquidity = calculate_locked_liquidity(&market_state)?;
            market_state.market_sides[market_side as usize].risk = current_market_side_risk
            .checked_add(risk)
            .ok_or(ExchangeError::AmountOverflow)?;
            market_state.market_sides[market_side as usize].payout = current_market_side_payout
                .checked_add(payout)
                .ok_or(ExchangeError::AmountOverflow)?;
            let new_moneyline_locked_liquidity = calculate_locked_liquidity(&market_state)?;
            new_locked_liquidity = market_state.locked_liquidity
                                    .checked_add(new_moneyline_locked_liquidity)
                                    .ok_or(ExchangeError::AmountOverflow)?
                                    .checked_sub(old_locked_liquidity)
                                    .ok_or(ExchangeError::AmountOverflow)?;
        } else {
            // TODO Use checked math here
             new_locked_liquidity = market_state.locked_liquidity
             .checked_add(payout)
             .ok_or(ExchangeError::AmountOverflow)?;
        }
        let current_locked_liquidity = market_state.locked_liquidity;
        let current_pool_locked_liquidity = pool_state.locked_liquidity;

        market_state.locked_liquidity = new_locked_liquidity;
        pool_state.locked_liquidity = current_pool_locked_liquidity
            .checked_sub(current_locked_liquidity)
            .ok_or(ExchangeError::AmountOverflow)?
            .checked_add(new_locked_liquidity)
            .ok_or(ExchangeError::NotEnoughAvailableLiquidityForBet)?;

        msg!("- Market locked liquidity from");
        msg!(0, 0, 0, 0, current_locked_liquidity);
        msg!("- Market locked liquidity to");
        msg!(0, 0, 0, 0, new_locked_liquidity);
        msg!("- Pool locked liquidity from");
        msg!(0, 0, 0, 0, current_pool_locked_liquidity);
        msg!("- Pool locked liquidity to");
        msg!(0, 0, 0, 0, pool_state.locked_liquidity);

        //Transfer USDT from user account to bet pool account
        let transfer_instruction = transfer(
            &token_program.key,
            &user_usdt_account.key,
            &bet_usdt_account.key,
            &initializer.key,
            &[&initializer.key],
            risk,
        )?;
        msg!("Transferring risk from user account to divvy account");
        invoke(
            &transfer_instruction,
            &[
                user_usdt_account.clone(),
                bet_usdt_account.clone(),
                initializer.clone(),
                token_program.clone(),
            ],
        )?;
        if new_locked_liquidity > current_locked_liquidity {
            let usdt_amount = new_locked_liquidity
                                    .checked_sub(current_locked_liquidity)
                                    .ok_or(ExchangeError::AmountOverflow)?;
            let signer_pubkeys = &[bet_pda_account.key];
    
            let mut data = Vec::with_capacity(size_of::<Self>());
            data.push(4);
            data.extend_from_slice(&usdt_amount.to_le_bytes());
            data.extend_from_slice(&bump_seed.to_le_bytes());
    
            let mut accounts = Vec::with_capacity(5 + signer_pubkeys.len());
            accounts.push(AccountMeta::new_readonly(*token_program.key, false));
            accounts.push(AccountMeta::new(*pda_account.key, false));
            for signer_pubkey in signer_pubkeys.iter() {
                accounts.push(AccountMeta::new_readonly(**signer_pubkey, true));
            }
            accounts.push(AccountMeta::new(*bet_usdt_account.key, false));
            accounts.push(AccountMeta::new(*hp_usdt_account.key, false));
            accounts.push(AccountMeta::new(*pool_state_account.key, false));
    
            let instruction = Instruction {
                program_id: *divvy_hp_program.key,
                accounts,
                data,
            };
            msg!("Transfer locked liquidity");
            invoke_signed(
                    &instruction,
                    &[
                        token_program.clone(),
                        pda_account.clone(),
                        bet_pda_account.clone(),
                        bet_usdt_account.clone(),
                        hp_usdt_account.clone(),
                        pool_state_account.clone(),
                    ],
                    &[&[b"divvybetting", &[251]]],
                )?;
        } else {
            let usdt_amount = current_locked_liquidity
                                    .checked_sub(new_locked_liquidity)
                                    .ok_or(ExchangeError::AmountOverflow)?;
            let transfer_instruction = transfer(
                &token_program.key,
                &bet_usdt_account.key,
                &hp_usdt_account.key,
                &bet_pda_account.key,
                &[&bet_pda_account.key],
                usdt_amount
            )?;
            msg!("Transferring extra locked liquidity back to house pool");
            invoke_signed(
                &transfer_instruction,
                &[
                    hp_usdt_account.clone(),
                    bet_usdt_account.clone(),
                    bet_pda_account.clone(),
                    token_program.clone(),
                ],
                //To Do Please test bump seed thing
                &[&[b"divvybetting", &[251]]],
            )?;
        }
       
        // Initialize bet state
        bet_state = Bet {
            is_initialized: true,
            market: *market_state_account.key,
            user_usdt_account: *user_usdt_account.key,
            user_main_account: *initializer.key,
            user_risk: risk,
            user_payout: payout,
            points: points,
            user_market_side: market_side,
            outcome: 0, //Outcome 0 as market not settled.
            bet_type: bet_type
        };

        // Increment bettor balance
        market_state.bettor_balance  = market_state.bettor_balance + risk + new_locked_liquidity - current_locked_liquidity;

        // Write the accounts
        Bet::pack(bet_state, &mut bet_account.data.borrow_mut())?;
        BettingPoolState::pack(pool_state, &mut bet_pool_state_account.data.borrow_mut())?;
        Market::pack(market_state, &mut market_state_account.data.borrow_mut())?;

        Ok(())
    }

    fn process_settle_pnl(
        accounts: &[AccountInfo],
        bump_seed: u8,
        program_id: &Pubkey
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let _initializer = next_account_info(accounts_iter)?;
        let token_program = next_account_info(accounts_iter)?;
        let market_state_account = next_account_info(accounts_iter)?;
        let pda_account = next_account_info(accounts_iter)?;
        let bet_usdt_account = next_account_info(accounts_iter)?;
        let bet_pool_state_account = next_account_info(accounts_iter)?;
        let hp_usdt_account = next_account_info(accounts_iter)?;
        let insurance_fund_usdt_account = next_account_info(accounts_iter)?;
        let divvy_foundation_proceeds_usdt = next_account_info(accounts_iter)?;
        // Unpack token accounts to verify their length
        msg!("Check token account accounts length");
        TokenAccount::unpack(&hp_usdt_account.data.borrow())?;
        TokenAccount::unpack(&bet_usdt_account.data.borrow())?;
        TokenAccount::unpack(&insurance_fund_usdt_account.data.borrow())?;
        TokenAccount::unpack(&divvy_foundation_proceeds_usdt.data.borrow())?;
        let mut pool_state = BettingPoolState::unpack(&bet_pool_state_account.data.borrow())?;
        let mut market_state = Market::unpack(&market_state_account.data.borrow())?;
        let usd_state = TokenAccount::unpack(&bet_usdt_account.data.borrow())?;

        if *insurance_fund_usdt_account.key != pool_state.insurance_fund_usdt {
            return Err(ExchangeError::InvalidInsuranceFundUsdtAccount.into());
        }
        if *divvy_foundation_proceeds_usdt.key != pool_state.divvy_foundation_proceeds_usdt {
            return Err(ExchangeError::InvalidDivvyFoundationUsdtAccount.into());
        }
        if *token_program.key != token_program_id::ID {
            return Err(ExchangeError::InvalidInstruction.into());
        }
        if *market_state_account.owner != *program_id {
            return Err(ExchangeError::InvalidMarketAccount.into());
        }
        // Checking bet pool usdt account
        if *bet_usdt_account.key != pool_state.betting_pool_usdt {
            return Err(ExchangeError::InvalidBettingPoolUsdtAccount.into());
        }

        if *market_state_account.owner != *program_id {
            return Err(ExchangeError::InvalidMarketAccount.into());
        }
        if *token_program.key != token_program_id::ID {
            return Err(ExchangeError::InvalidInstruction.into());
        }

        //Checking if betting is frozen
        if pool_state.frozen_betting {
            return Err(ExchangeError::BettingFrozen.into());
        }
        let result = match market_state.result {
            MarketOutcome::MarketSide0Won => 0,
            MarketOutcome::MarketSide1Won => 1,
            MarketOutcome::MarketSide2Won => 2,
            _ => return Err(ExchangeError::NotValidMarketResult.into()),
        };
        msg!("Market Bettor balance: {}", market_state.bettor_balance);
        msg!("Market locked liquidity: {}",  market_state.locked_liquidity);
        if market_state.pending_bets == 0 {
            if market_state.locked_liquidity>=market_state.bettor_balance {
                // House made a loss, return locked liquidity
                msg!("Transfering locked liquidity to house pool");
                let transfer_instruction = transfer(
                    &token_program.key,
                    &bet_usdt_account.key,
                    &hp_usdt_account.key,
                    &pda_account.key,
                    &[&pda_account.key],
                    (market_state.bettor_balance).clone(),
                )?;
                invoke_signed(
                    &transfer_instruction,
                    &[
                        bet_usdt_account.clone(),
                        hp_usdt_account.clone(),
                        pda_account.clone(),
                        token_program.clone(),
                    ],
                    &[&[b"divvybetting", &[251]]],
                )?;
            } else {
                // House made a profit, send 5% to Profit pool and 1% to insurance pool
                let house_profit_frac: U64F64 = U64F64::from_num(market_state.bettor_balance - market_state.locked_liquidity);
                msg!("House profit: {}", house_profit_frac);
                let insurance_fund_fee: u64 = (house_profit_frac * U64F64::from_num(0.01))
                    .checked_to_num()
                    .ok_or(ExchangeError::AmountOverflow)?;
                msg!("Insurance fees: {}", insurance_fund_fee);
                let divvy_foundation_fee: u64 = (house_profit_frac * U64F64::from_num(0.05))
                    .checked_to_num()
                    .ok_or(ExchangeError::AmountOverflow)?;
                msg!("Foundation fee: {}", divvy_foundation_fee);
                let total_house_profit: u64 = ((house_profit_frac * U64F64::from_num(0.94)) +  U64F64::from_num(market_state.locked_liquidity))
                    .checked_to_num()
                    .ok_or(ExchangeError::AmountOverflow)?;
                msg!("Total House return: {}", total_house_profit);
                msg!("Transfering USDT to the insurance fund");
                let transfer_instruction = transfer(
                    &token_program.key,
                    &bet_usdt_account.key,
                    &insurance_fund_usdt_account.key,
                    &pda_account.key,
                    &[&pda_account.key],
                    insurance_fund_fee.clone(),
                )?;
                invoke_signed(
                    &transfer_instruction,
                    &[
                        bet_usdt_account.clone(),
                        insurance_fund_usdt_account.clone(),
                        pda_account.clone(),
                        token_program.clone(),
                    ],
                    &[&[b"divvybetting", &[251]]],
                )?;
                msg!("Transfering USDT to the Divvy foundation");
                let transfer_instruction = transfer(
                    &token_program.key,
                    &bet_usdt_account.key,
                    &divvy_foundation_proceeds_usdt.key,
                    &pda_account.key,
                    &[&pda_account.key],
                    divvy_foundation_fee.clone(),
                )?;
                invoke_signed(
                    &transfer_instruction,
                    &[
                        bet_usdt_account.clone(),
                        divvy_foundation_proceeds_usdt.clone(),
                        pda_account.clone(),
                        token_program.clone(),
                    ],
                    &[&[b"divvybetting", &[251]]],
                )?;
                msg!("Transfering locked liquidity to house pool");
                let transfer_instruction = transfer(
                    &token_program.key,
                    &bet_usdt_account.key,
                    &hp_usdt_account.key,
                    &pda_account.key,
                    &[&pda_account.key],
                    (total_house_profit).clone(),
                )?;
                invoke_signed(
                    &transfer_instruction,
                    &[
                        bet_usdt_account.clone(),
                        hp_usdt_account.clone(),
                        pda_account.clone(),
                        token_program.clone(),
                    ],
                    &[&[b"divvybetting", &[251]]],
                )?;
            }
            // msg!("Market pending bets are settled. Asserting.");
            // if market_state.market_sides[market_state.result as usize].risk != 0 {
            //     return Err(ExchangeError::MarketSideRiskRemaining.into());
            // }
            // if market_state.market_sides[market_state.result as usize].payout != 0 {
            //     return Err(ExchangeError::MarketSidePayoutRemaining.into());
            // }
            // if market_state.bettor_balance != 0 {
            //     return Err(ExchangeError::MarketBettorBalanceRemaining.into());
            // }
            pool_state.live_liquidity = pool_state
                                        .live_liquidity
                                        .checked_sub(market_state.locked_liquidity)
                                        .ok_or(ExchangeError::AmountOverflow)?;
            market_state.result = MarketOutcome::Settled;
        } else {
            return Err(ExchangeError::MarketSideRiskRemaining.into());
        }
        //Assert that when all of the house pool pending bets are settled there is
        //no remaining bettor balance in the house pool.
        // msg!("Transfering locked liquidity to house pool");
        // let transfer_instruction = transfer(
        //     &token_program.key,
        //     &bet_usdt_account.key,
        //     &hp_usdt_account.key,
        //     &pda_account.key,
        //     &[&pda_account.key],
        //     usd_state.amount
        // )?;
        // invoke_signed(
        //     &transfer_instruction,
        //     &[
        //         bet_usdt_account.clone(),
        //         hp_usdt_account.clone(),
        //         pda_account.clone(),
        //         token_program.clone(),
        //     ],
        //     &[&[b"divvybetting", &[251]]],
        // )?;
        if pool_state.pending_bets == 0 {
            // msg!("House pool pending bets are settled. Asserting.");
            // if pool_state.locked_liquidity != 0 {
            //     return Err(ExchangeError::HousePoolLockedLiquidityRemaining.into());
            // }
            // if pool_state.live_liquidity != 0 {
            //     return Err(ExchangeError::HousePoolLockedLiquidityRemaining.into());
            // }
        }
        BettingPoolState::pack(pool_state, &mut bet_pool_state_account.data.borrow_mut())?;
        Market::pack(market_state, &mut market_state_account.data.borrow_mut())?;
        Ok(())
    }

    fn process_settle_bet(
        accounts: &[AccountInfo],
        bump_seed: u8,
        program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let _initializer = next_account_info(accounts_iter)?;
        let token_program = next_account_info(accounts_iter)?;
        let market_state_account = next_account_info(accounts_iter)?;
        let bet_state_account = next_account_info(accounts_iter)?;
        let pda_account = next_account_info(accounts_iter)?;
        let bet_usdt_account = next_account_info(accounts_iter)?;
        let user_usdt_account = next_account_info(accounts_iter)?;
        let user_main_account = next_account_info(accounts_iter)?;
        let bet_pool_state_account = next_account_info(accounts_iter)?;
        let hp_usdt_account = next_account_info(accounts_iter)?;
        let insurance_fund_usdt_account = next_account_info(accounts_iter)?;
        let divvy_foundation_proceeds_usdt = next_account_info(accounts_iter)?;
        // Unpack token accounts to verify their length
        msg!("Check token account accounts length");
        TokenAccount::unpack(&hp_usdt_account.data.borrow())?;
        TokenAccount::unpack(&bet_usdt_account.data.borrow())?;
        TokenAccount::unpack(&insurance_fund_usdt_account.data.borrow())?;
        TokenAccount::unpack(&divvy_foundation_proceeds_usdt.data.borrow())?;
        let mut pool_state = BettingPoolState::unpack(&bet_pool_state_account.data.borrow())?;
        let mut market_state = Market::unpack(&market_state_account.data.borrow())?;
        let mut bet_state = Bet::unpack(&bet_state_account.data.borrow())?;

        if *insurance_fund_usdt_account.key != pool_state.insurance_fund_usdt {
            return Err(ExchangeError::InvalidInsuranceFundUsdtAccount.into());
        }
        if *divvy_foundation_proceeds_usdt.key != pool_state.divvy_foundation_proceeds_usdt {
            return Err(ExchangeError::InvalidDivvyFoundationUsdtAccount.into());
        }
        if *token_program.key != token_program_id::ID {
            return Err(ExchangeError::InvalidInstruction.into());
        }
        if *market_state_account.owner != *program_id {
            return Err(ExchangeError::InvalidMarketAccount.into());
        }
        // Checking bet pool usdt account
        if *bet_usdt_account.key != pool_state.betting_pool_usdt {
            return Err(ExchangeError::InvalidBettingPoolUsdtAccount.into());
        }

        if *market_state_account.owner != *program_id {
            return Err(ExchangeError::InvalidMarketAccount.into());
        }
        if *token_program.key != token_program_id::ID {
            return Err(ExchangeError::InvalidInstruction.into());
        }

        if bet_state.market != *market_state_account.key {
            return Err(ExchangeError::ExpectedDataMismatch.into());
        }

        //Checking if betting is frozen
        if pool_state.frozen_betting {
            return Err(ExchangeError::BettingFrozen.into());
        }
        if market_state.result == MarketOutcome::NotYetCommenced {
            return Err(ExchangeError::MarketNotSettled.into());
        }

        if bet_state.user_usdt_account != *user_usdt_account.key {
            return Err(ExchangeError::ExpectedDataMismatch.into());
        }

        if bet_state.user_main_account != *user_main_account.key {
            return Err(ExchangeError::ExpectedDataMismatch.into());
        }

        if bet_state.outcome != 0 {
            return Err(ExchangeError::BetAlreadySettled.into());
        }

        // Decrement pending bets
        msg!("Decrementing market pending bets.");
        market_state.pending_bets = market_state
            .pending_bets
            .checked_sub(1)
            .ok_or(ExchangeError::AmountOverflow)?;

        msg!("Decrementing betting pool pending bets.");
        msg!(" {} ",pool_state.pending_bets);
        pool_state.pending_bets = pool_state
            .pending_bets
            .checked_sub(1)
            .ok_or(ExchangeError::AmountOverflow)?;
        
        let outcome = get_bet_outcome(&bet_state, &market_state);
        bet_state.outcome = outcome;
        if outcome == 1 {
            // User won
            let bet_balance = bet_state
                .user_risk
                .checked_add(bet_state.user_payout)
                .ok_or(ExchangeError::AmountOverflow)?;

            // Subtract bettor balance in the market and house pool
            // Only for winning bets, as when the market settles,
            // the balance is changed to only include the winning sides risk and payout
            market_state.bettor_balance = market_state
                .bettor_balance
                .checked_sub(bet_balance)
                .ok_or(ExchangeError::AmountOverflow)?;

            //Remove risk & payout in market side. Only for winning bets, as locked
            // liquidity was already calculated for losers.
            if bet_state.bet_type == BetType::MoneyLine {
                let current_market_side_risk =
                market_state.market_sides[bet_state.user_market_side as usize].risk;
                let current_market_side_payout =
                    market_state.market_sides[bet_state.user_market_side as usize].payout;
                market_state.market_sides[bet_state.user_market_side as usize].risk =
                    current_market_side_risk
                        .checked_sub(bet_state.user_risk)
                        .ok_or(ExchangeError::MarketSideRiskUnderflow)?;
                market_state.market_sides[bet_state.user_market_side as usize].payout =
                    current_market_side_payout
                        .checked_sub(bet_state.user_payout)
                        .ok_or(ExchangeError::MarketSidePayoutUnderflow)?;
            }

            let transfer_instruction = transfer(
                &token_program.key,
                &bet_usdt_account.key,
                &user_usdt_account.key,
                &pda_account.key,
                &[&pda_account.key],
                bet_balance,
            )?;
            msg!("Calling the token program to transfer winnings to user.");
            invoke_signed(
                &transfer_instruction,
                &[
                    user_usdt_account.clone(),
                    bet_usdt_account.clone(),
                    pda_account.clone(),
                    token_program.clone(),
                ],
                //To Do Please test bump seed thing
                &[&[b"divvybetting", &[251]]],
            )?;
        }
        if outcome == 3 {
            // Push
        }
        //Return rent to the user that placed the bet
        let balance = bet_state_account.lamports();
        **bet_state_account.try_borrow_mut_lamports()? -= balance;
        **user_main_account.try_borrow_mut_lamports()? += balance;
        BettingPoolState::pack(pool_state, &mut bet_pool_state_account.data.borrow_mut())?;
        Market::pack(market_state, &mut market_state_account.data.borrow_mut())?;
        Bet::pack(bet_state, &mut bet_state_account.data.borrow_mut())?;
        Ok(())
    }

    fn process_init_market(
        accounts: &[AccountInfo],
        bump_seed: u8,
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let initializer = next_account_info(accounts_iter)?;
        let market_state_account = next_account_info(accounts_iter)?;
        let result_feed_account = next_account_info(accounts_iter)?;
        let bet_pool_state_account = next_account_info(accounts_iter)?;
        let market_side_0_odds_feed_account = next_account_info(accounts_iter)?;
        let market_side_1_odds_feed_account = next_account_info(accounts_iter)?;
        let market_side_2_odds_feed_account = next_account_info(accounts_iter)?;
        let market_side_0_points_feed_account = next_account_info(accounts_iter)?;
        let market_side_1_points_feed_account = next_account_info(accounts_iter)?;
        msg!("Checking if initializer is signer");
        if !initializer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        msg!("Checking if initializer is authorized");
        if initializer.key != &authority::ID {
            return Err(ExchangeError::NotValidAuthority.into());
        }
        msg!("Unpack pool state");
        let pool_state = BettingPoolState::unpack(&bet_pool_state_account.data.borrow())?;
        msg!("Unpack market state");
        let mut market_state = Market::unpack_unchecked(&market_state_account.data.borrow())?;

        //Checking if betting is frozen
        if pool_state.frozen_betting {
            return Err(ExchangeError::BettingFrozen.into());
        }
        if market_state.is_initialized {
            return Err(ExchangeError::MarketAlreadyInitialized.into());
        }
        if !Rent::get()?.is_exempt(
            **market_state_account.lamports.borrow(),
            market_state_account.data_len(),
        ) {
            return Err(ProgramError::AccountNotRentExempt);
        }

        let market_sides: [MarketSide; 3] = 
                [
                    MarketSide {
                        odds_feed_account: Some(*market_side_0_odds_feed_account.key),
                        points_feed_account: Some(*market_side_0_points_feed_account.key),
                        payout: 0,
                        risk: 0,
                    },
                    MarketSide {
                        odds_feed_account: Some(*market_side_1_odds_feed_account.key),
                        points_feed_account: Some(*market_side_1_points_feed_account.key),
                        payout: 0,
                        risk: 0,
                    },
                    MarketSide {
                        odds_feed_account: Some(*market_side_2_odds_feed_account.key),
                        points_feed_account: None,
                        payout: 0,
                        risk: 0,
                    },
                ];

        market_state = Market {
            is_initialized: true,
            market_sides: market_sides,
            locked_liquidity: 0,
            result_feed: *result_feed_account.key,
            result: MarketOutcome::NotYetCommenced,
            bettor_balance: 0,
            pending_bets: 0,
            team_a_score: 0,
            team_b_score: 0,
            total_score: 0
        };
        Market::pack(market_state, &mut market_state_account.data.borrow_mut())?;

        Ok(())
    }

    fn process_init_futures_market(
        accounts: &[AccountInfo],
        bump_seed: u8,
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let initializer = next_account_info(accounts_iter)?;
        let market_state_account = next_account_info(accounts_iter)?;
        let result_feed_account = next_account_info(accounts_iter)?;
        let bet_pool_state_account = next_account_info(accounts_iter)?;
        let market_side_0_odds_feed_account = next_account_info(accounts_iter)?;
        let market_side_1_odds_feed_account = next_account_info(accounts_iter)?;
        let market_side_2_odds_feed_account = next_account_info(accounts_iter)?;
        let market_side_0_points_feed_account = next_account_info(accounts_iter)?;
        let market_side_1_points_feed_account = next_account_info(accounts_iter)?;
        msg!("Checking if initializer is signer");
        if !initializer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        msg!("Checking if initializer is authorized");
        if initializer.key != &authority::ID {
            return Err(ExchangeError::NotValidAuthority.into());
        }
        msg!("Unpack pool state");
        let pool_state = BettingPoolState::unpack(&bet_pool_state_account.data.borrow())?;
        msg!("Unpack market state");
        let mut market_state = Market::unpack_unchecked(&market_state_account.data.borrow())?;

        //Checking if betting is frozen
        if pool_state.frozen_betting {
            return Err(ExchangeError::BettingFrozen.into());
        }
        if market_state.is_initialized {
            return Err(ExchangeError::MarketAlreadyInitialized.into());
        }
        if !Rent::get()?.is_exempt(
            **market_state_account.lamports.borrow(),
            market_state_account.data_len(),
        ) {
            return Err(ProgramError::AccountNotRentExempt);
        }

        let market_sides: [MarketSide; 3] = 
                [
                    MarketSide {
                        odds_feed_account: Some(*market_side_0_odds_feed_account.key),
                        points_feed_account: Some(*market_side_0_points_feed_account.key),
                        payout: 0,
                        risk: 0,
                    },
                    MarketSide {
                        odds_feed_account: Some(*market_side_1_odds_feed_account.key),
                        points_feed_account: Some(*market_side_1_points_feed_account.key),
                        payout: 0,
                        risk: 0,
                    },
                    MarketSide {
                        odds_feed_account: Some(*market_side_2_odds_feed_account.key),
                        points_feed_account: None,
                        payout: 0,
                        risk: 0,
                    },
                ];

        market_state = Market {
            is_initialized: true,
            market_sides: market_sides,
            locked_liquidity: 0,
            result_feed: *result_feed_account.key,
            result: MarketOutcome::NotYetCommenced,
            bettor_balance: 0,
            pending_bets: 0,
            team_a_score: 0,
            team_b_score: 0,
            total_score: 0
        };
        Market::pack(market_state, &mut market_state_account.data.borrow_mut())?;

        Ok(())
    }

    fn process_settle_market(
        accounts: &[AccountInfo],
        bump_seed: u8,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let _initializer = next_account_info(accounts_iter)?;
        let market_state_account = next_account_info(accounts_iter)?;
        let bet_pool_state_account = next_account_info(accounts_iter)?;
        let result_account = next_account_info(accounts_iter)?;
        let teama_points_account = next_account_info(accounts_iter)?;
        let teamb_points_account = next_account_info(accounts_iter)?;
        let hp_usdt_account = next_account_info(accounts_iter)?;
        let mut market_state = Market::unpack(&market_state_account.data.borrow())?;
        let pool_state = BettingPoolState::unpack(&bet_pool_state_account.data.borrow())?;

        // Checking house pool usdt account
        if *hp_usdt_account.key != pool_state.house_pool_usdt {
            return Err(ExchangeError::InvalidHousePoolUsdtAccount.into());
        }

        // Checking bet pool usdt account

        //Checking if betting is frozen
        if pool_state.frozen_betting {
            return Err(ExchangeError::BettingFrozen.into());
        }
        //Verifying result account
        if result_account.key != &market_state.result_feed {
            return Err(ExchangeError::NotValidAuthority.into());
        }
        //Checking if market is not settled yet
        //TODO check if market is not commenced  and issue a different warning
        if market_state.result != MarketOutcome::Commenced
        {
            return Err(ExchangeError::MarketAlreadySettled.into());
        }
        //Getting results from Switchboard
        msg!("Unpacking switchboard aggregator.");
        let aggregator: AggregatorState = get_aggregator(result_account)?;
        msg!("Unpacking switchboard result.");
        let round_result: RoundResult = get_aggregator_result(&aggregator)?;
        msg!("Unpacking switchboard result option.");
        let result_u8 = round_result
            .result
            .ok_or(ExchangeError::FeedNotInitialized)? as u8;
        msg!("- Result feed");
        msg!(0, 0, 0, 0, result_u8);
        if result_u8 > 2 {
            return Err(ExchangeError::NotValidMarketResult.into());
        }

        //Getting team A score from Switchboard
        msg!("Unpacking switchboard aggregator.");
        let aggregator: AggregatorState = get_aggregator(teama_points_account)?;
        msg!("Unpacking switchboard result.");
        let round_result: RoundResult = get_aggregator_result(&aggregator)?;
        msg!("Unpacking switchboard result option.");
        let teama_u16 = round_result
            .result
            .ok_or(ExchangeError::FeedNotInitialized)? as u16;
        msg!("Team A score: {}", teama_u16);

                
        //Getting team B score from Switchboard
        msg!("Unpacking switchboard aggregator.");
        let aggregator: AggregatorState = get_aggregator(teamb_points_account)?;
        msg!("Unpacking switchboard result.");
        let round_result: RoundResult = get_aggregator_result(&aggregator)?;
        msg!("Unpacking switchboard result option.");
        let teamb_u16 = round_result
            .result
            .ok_or(ExchangeError::FeedNotInitialized)? as u16;
        msg!("Team B score: {}", teamb_u16);

        let total_score = teama_u16 + teamb_u16;
        let result = match result_u8 {
            0 => MarketOutcome::MarketSide0Won,
            1 => MarketOutcome::MarketSide1Won,
            2 => MarketOutcome::MarketSide2Won,
            3 => MarketOutcome::NotYetCommenced,
            4 => MarketOutcome::Commenced,
            _ => return Err(ExchangeError::NotValidMarketResult.into()),
        };


        msg!("- Market state");
        msg!(market_state.result.into());

        market_state.result = result;
        market_state.team_a_score = teama_u16;
        market_state.team_b_score = teamb_u16;
        market_state.total_score = total_score;

        Market::pack(market_state, &mut market_state_account.data.borrow_mut())?;
        BettingPoolState::pack(pool_state, &mut bet_pool_state_account.data.borrow_mut())?;

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
        let bet_pool_state_account = next_account_info(accounts_iter)?;
        let hp_usdt_account = next_account_info(accounts_iter)?;
        let bet_usdt_account = next_account_info(accounts_iter)?;
        let insurance_fund_usdt_account = next_account_info(accounts_iter)?;
        let divvy_foundation_proceeds_usdt = next_account_info(accounts_iter)?;
        msg!("Unpack Betting Pool State account");
        let mut pool_state = BettingPoolState::unpack_unchecked(&bet_pool_state_account.data.borrow())?;
        msg!("Check Betting Pool State Init");
        if pool_state.is_initialized {
            return Err(ExchangeError::BettingPoolStateAlreadyInitialized.into());
        }
        msg!("Check Rent Exemption");
        if !Rent::get()?.is_exempt(
            **bet_pool_state_account.lamports.borrow(),
            bet_pool_state_account.data_len(),
        ) {
            return Err(ProgramError::AccountNotRentExempt);
        }
        // Unpack token accounts to verify their length
        msg!("Check token account accounts length");
        TokenAccount::unpack(&hp_usdt_account.data.borrow())?;
        TokenAccount::unpack(&bet_usdt_account.data.borrow())?;
        TokenAccount::unpack(&insurance_fund_usdt_account.data.borrow())?;
        TokenAccount::unpack(&divvy_foundation_proceeds_usdt.data.borrow())?;

        msg!("Check authority");
        if initializer.key != &authority::ID {
            return Err(ExchangeError::NotValidAuthority.into());
        }

        msg!("Initalizing Betting Pool State account");
        pool_state = BettingPoolState {
            is_initialized: true,
            locked_liquidity: 0,
            live_liquidity: 0,
            pending_bets: 0,
            house_pool_usdt: *hp_usdt_account.key,
            betting_pool_usdt: *bet_usdt_account.key,
            insurance_fund_usdt: *insurance_fund_usdt_account.key,
            divvy_foundation_proceeds_usdt: *divvy_foundation_proceeds_usdt.key,
            frozen_betting: false,
        };
        BettingPoolState::pack(pool_state, &mut bet_pool_state_account.data.borrow_mut())?;
        Ok(())
    }

    pub fn process_commence_market(
        accounts: &[AccountInfo],
        bump_seed: u8,
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let initializer = next_account_info(accounts_iter)?;
        msg!("Check if initializer is a signer");
        if !initializer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        msg!("Check authority");
        if initializer.key != &authority::ID {
            return Err(ExchangeError::NotValidAuthority.into());
        }
        let market_state_account = next_account_info(accounts_iter)?;
        let bet_pool_state_account = next_account_info(accounts_iter)?;

        let mut market_state = Market::unpack(&market_state_account.data.borrow())?;
        let mut pool_state = BettingPoolState::unpack(&bet_pool_state_account.data.borrow())?;

        //Check house pool porgram ID
        // divvy_house_program_id::ID

        //Checking if betting is frozen: Should we?
        if pool_state.frozen_betting {
            return Err(ExchangeError::BettingFrozen.into());
        }
        msg!("Check market commence status");
        if market_state.result != MarketOutcome::NotYetCommenced {
            return Err(ExchangeError::MarketCommenced.into());
        }

        market_state.result = MarketOutcome::Commenced;
        pool_state.locked_liquidity = pool_state
            .locked_liquidity
            .checked_sub(market_state.locked_liquidity)
            .ok_or(ExchangeError::AmountOverflow)?;
        pool_state.live_liquidity = pool_state
            .live_liquidity
            .checked_add(market_state.locked_liquidity)
            .ok_or(ExchangeError::AmountOverflow)?;

        Market::pack(market_state, &mut market_state_account.data.borrow_mut())?;
        BettingPoolState::pack(pool_state, &mut bet_pool_state_account.data.borrow_mut())?;

        Ok(())
    }

    pub fn process_freeze(
        accounts: &[AccountInfo],
        _program_id: &Pubkey,
        freeze_betting: bool,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let initializer = next_account_info(accounts_iter)?;
        let bet_pool_state_account = next_account_info(accounts_iter)?;

        if !initializer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        if initializer.key != &authority::ID {
            return Err(ExchangeError::NotValidAuthority.into());
        }

        let mut pool_state = BettingPoolState::unpack(&bet_pool_state_account.data.borrow())?;
  
        if freeze_betting && !pool_state.frozen_betting {
            msg!("Freezing betting");
        } else if !freeze_betting && pool_state.frozen_betting {
            msg!("Unfreezing betting");
        }

        pool_state.frozen_betting = freeze_betting;

        BettingPoolState::pack(pool_state, &mut bet_pool_state_account.data.borrow_mut())?;

        Ok(())
    }

    pub fn process_init_new_bust(
        accounts: &[AccountInfo],
        multiplier: u32,
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let initializer = next_account_info(accounts_iter)?;
        let bust_state_account = next_account_info(accounts_iter)?;
        let current_multiplier_state_account = next_account_info(accounts_iter)?;
        let previous_multiplier_state_account = next_account_info(accounts_iter)?;


        // Add check here to check that the bust account is same as the one which we'll use when we do deployment
        if !initializer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        if initializer.key != &authority::ID {
            return Err(ExchangeError::NotValidAuthority.into());
        }

        let mut current_mul_state = Multiplier {
            multiplier: 0,
            counter: 0,
            busted: false
        };

        let mut previous_mul_state = Multiplier::unpack(&previous_multiplier_state_account.data.borrow())?;

        previous_mul_state.busted = true;
        previous_mul_state.multiplier = multiplier;

        let mut bust_state = SolBust::unpack(&bust_state_account.data.borrow())?;
        bust_state.current_pubkey = *current_multiplier_state_account.key;
        bust_state.previous_pubkey = *previous_multiplier_state_account.key;
        bust_state.previous_multiplier = bust_state.current_multiplier;
        bust_state.current_multiplier = 0;
        // let bust_state = SolBust {
        //     is_initialized: true,
        //     current_pubkey: *bust_state_account.key,
        //     previous_pubkey: *bust_state_account.key,
        //     current_multiplier: 0,
        //     previous_multiplier: 0,
        // };
        
        Multiplier::pack(&previous_mul_state, &mut previous_multiplier_state_account.data.borrow_mut());
        Multiplier::pack(&current_mul_state, &mut current_multiplier_state_account.data.borrow_mut());
        SolBust::pack(bust_state, &mut bust_state_account.data.borrow_mut())?;
        Ok(())
    }

    pub fn process_init_bust_bet(
        accounts: &[AccountInfo],
        _program_id: &Pubkey,
        risk: u16,
        multiplier: u32
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let bust_state_account = next_account_info(accounts_iter)?;
        let bust_bet_account = next_account_info(accounts_iter)?;
        let token_program = next_account_info(accounts_iter)?;
        let bet_usdt_account = next_account_info(accounts_iter)?;
        let user_usdt_account = next_account_info(accounts_iter)?;
        let multiplier_account = next_account_info(accounts_iter)?;
        let initializer = next_account_info(accounts_iter)?;

        let bust_state = SolBust::unpack(&bust_state_account.data.borrow())?;
        let mut multiplier_state = Multiplier::unpack(&multiplier_account.data.borrow())?;
        // Check to confirm it's the same account

        // Check to confirm multipliers

        //Transfer USDT from user account to bet pool account
        let transfer_instruction = transfer(
            &token_program.key,
            &user_usdt_account.key,
            &bet_usdt_account.key,
            &initializer.key,
            &[&initializer.key],
            risk.into(),
        )?;
        msg!("Transferring risk from user account to divvy account");
        invoke(
            &transfer_instruction,
            &[
                user_usdt_account.clone(),
                bet_usdt_account.clone(),
                initializer.clone(),
                token_program.clone(),
            ],
        )?;
        let bust_bet_state = BustBet {
            user_main_pubkey: *initializer.key,
            user_usdt_pubkey: *user_usdt_account.key,
            risk: risk,
            user_multiplier: multiplier,
            actual_multiplier_pubkey: bust_state.current_pubkey
        };



        multiplier_state.counter = multiplier_state.counter + 1;
        Multiplier::pack(&multiplier_state, &mut multiplier_account.data.borrow_mut());
        BustBet::pack(&bust_bet_state, &mut bust_bet_account.data.borrow_mut());
        Ok(())
    }

    pub fn process_settle_bust_bet(
        accounts: &[AccountInfo],
        _program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let bust_bet_account = next_account_info(accounts_iter)?;
        let token_program = next_account_info(accounts_iter)?;
        let bet_usdt_account = next_account_info(accounts_iter)?;
        let user_usdt_account = next_account_info(accounts_iter)?;
        let multiplier_account = next_account_info(accounts_iter)?;
        let initializer = next_account_info(accounts_iter)?;

        let bust_bet_state = BustBet::unpack(&bust_bet_account.data.borrow())?;
        let multiplier_state = Multiplier::unpack(&multiplier_account.data.borrow())?;
        
        if bust_bet_state.user_multiplier <= multiplier_state.multiplier {
            let payout = calculate_bust_payout(bust_bet_state.risk, bust_bet_state.user_multiplier).ok_or(ExchangeError::InvalidInstruction)?;
            //User won, transfer USDT from bet pool to user
            let transfer_instruction = transfer(
                &token_program.key,
                &bet_usdt_account.key,
                &bust_bet_state.user_usdt_pubkey,
                &initializer.key,
                &[&initializer.key],
                payout,
            )?;
            msg!("Transferring payout from divvy account to user account");
            invoke(
                &transfer_instruction,
                &[
                    user_usdt_account.clone(),
                    bet_usdt_account.clone(),
                    initializer.clone(),
                    token_program.clone(),
                ],
            )?;
        }
        Ok(())
    }
}
