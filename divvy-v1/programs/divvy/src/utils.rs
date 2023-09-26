pub fn calculate_moon_shot_payout(risk: u16, multiplier: u32) -> Option<u64> {
    Some((risk as f64 * (multiplier as f64 / 100f64)) as u64)
}