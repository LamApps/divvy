use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
};

use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};


pub struct HpLiquidity {
    pub is_initialized: bool,
    pub ht_mint: Pubkey,
    pub betting_usdt: Pubkey,
    pub pool_usdt: Pubkey,
    pub frozen_pool: bool,
}

impl IsInitialized for HpLiquidity {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

// Trait Seal implemented for HpLiquidity
impl Sealed for HpLiquidity {}

impl Pack for HpLiquidity {
    const LEN: usize = 98;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, HpLiquidity::LEN];
        let (
            is_initialized,
            ht_mint,
            betting_usdt,
            pool_usdt,
            frozen_pool,
        ) = array_refs![src,1, 32, 32, 32, 1];

        Ok(HpLiquidity {
            is_initialized: is_initialized[0] != 0,
            ht_mint: Pubkey::new_from_array(*ht_mint),
            betting_usdt: Pubkey::new_from_array(*betting_usdt),
            pool_usdt: Pubkey::new_from_array(*pool_usdt),
            frozen_pool: frozen_pool[0] != 0,
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, HpLiquidity::LEN];
        let (
            is_initialized_dst,
            ht_mint_dst,
            betting_usdt_dst,
            pool_usdt_dst,
            frozen_pool_dst,
        ) = mut_array_refs![dst, 1, 32, 32, 32, 1];

        let HpLiquidity {
            is_initialized,
            ht_mint,
            betting_usdt,
            pool_usdt,
            frozen_pool,
        } = self;
        is_initialized_dst[0] = *is_initialized as u8;
        ht_mint_dst.copy_from_slice(ht_mint.as_ref());
        betting_usdt_dst.copy_from_slice(betting_usdt.as_ref());
        pool_usdt_dst.copy_from_slice(pool_usdt.as_ref());
        frozen_pool_dst[0] = *frozen_pool as u8;
    }
}


pub struct BettingPoolState {
    pub is_initialized: bool,
    pub locked_liquidity: u64,
    pub live_liquidity: u64,
    pub pending_bets: u64,
    pub house_pool_usdt: Pubkey,
    pub betting_pool_usdt: Pubkey,
    pub insurance_fund_usdt: Pubkey,
    pub divvy_foundation_proceeds_usdt: Pubkey,
    pub frozen_betting: bool,
}

impl Sealed for BettingPoolState {}

impl IsInitialized for BettingPoolState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for BettingPoolState {
    const LEN: usize = 154;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, BettingPoolState::LEN];
        let (
            is_initialized,
            locked_liquidity,
            live_liquidity,
            pending_bets,
            house_pool_usdt,
            betting_pool_usdt,
            insurance_fund_usdt,
            divvy_foundation_proceeds_usdt,
            frozen_betting,
        ) = array_refs![src, 1, 8, 8, 8, 32, 32, 32, 32, 1];

        Ok(BettingPoolState {
            is_initialized: is_initialized[0] != 0,
            locked_liquidity: u64::from_le_bytes(*locked_liquidity),
            live_liquidity: u64::from_le_bytes(*live_liquidity),
            pending_bets: u64::from_le_bytes(*pending_bets),
            house_pool_usdt: Pubkey::new_from_array(*house_pool_usdt),
            betting_pool_usdt: Pubkey::new_from_array(*betting_pool_usdt),
            insurance_fund_usdt: Pubkey::new_from_array(*insurance_fund_usdt),
            divvy_foundation_proceeds_usdt: Pubkey::new_from_array(*divvy_foundation_proceeds_usdt),
            frozen_betting: frozen_betting[0] != 0,
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, BettingPoolState::LEN];
        let (
            is_initialized_dst,
            locked_liquidity_dst,
            live_liquidity_dst,
            pending_bets_dst,
            house_pool_usdt_dst,
            betting_pool_usdt_dst,
            insurance_fund_usdt_dst,
            divvy_foundation_proceeds_usdt_dst,
            frozen_betting_dst,
        ) = mut_array_refs![dst, 1, 8, 8, 8, 32, 32, 32, 32, 1];

        let BettingPoolState {
            is_initialized,
            locked_liquidity,
            live_liquidity,
            pending_bets,
            house_pool_usdt,
            betting_pool_usdt,
            insurance_fund_usdt,
            divvy_foundation_proceeds_usdt,
            frozen_betting,
        } = self;
        is_initialized_dst[0] = *is_initialized as u8;
        *locked_liquidity_dst = locked_liquidity.to_le_bytes();
        *live_liquidity_dst = live_liquidity.to_le_bytes();
        *pending_bets_dst = pending_bets.to_le_bytes();
        house_pool_usdt_dst.copy_from_slice(house_pool_usdt.as_ref());
        betting_pool_usdt_dst.copy_from_slice(betting_pool_usdt.as_ref());
        insurance_fund_usdt_dst.copy_from_slice(insurance_fund_usdt.as_ref());
        divvy_foundation_proceeds_usdt_dst.copy_from_slice(divvy_foundation_proceeds_usdt.as_ref());
        frozen_betting_dst[0] = *frozen_betting as u8;
    }
}
