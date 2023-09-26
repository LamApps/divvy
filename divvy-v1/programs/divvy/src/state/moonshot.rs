use anchor_lang::prelude::*;

#[account]
pub struct MoonShot {
    pub current_pubkey: Pubkey,
    pub previous_pubkey: Pubkey,
    pub current_multiplier: u32,
    pub previous_multiplier: u32,
}
#[account]
pub struct Multiplier {
    pub multiplier: u32,
    pub counter: u64,
    pub busted: bool,
}


#[account]
pub struct MoonShootBet {
    pub user_main_pubkey: Pubkey,
    pub user_usdt_pubkey: Pubkey,
    pub risk: u16,
    pub user_multiplier: u32,
    pub actual_multiplier_pubkey: Pubkey
}