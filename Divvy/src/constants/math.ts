import { parse } from "@fortawesome/fontawesome-svg-core";
import BN from "bn.js";

export const TEN = new BN(10);
export const HALF_WAD = TEN.pow(new BN(18));
export const WAD = TEN.pow(new BN(18));
export const RAY = TEN.pow(new BN(27));
export const ZERO = new BN(0);
export const LAMPORTS_PER_SOL = 1000000000;
export const LAMPORTS_PER_USDC = 1000000;
export const LAMPORTS_PER_HP = 1000000;
export const MS_IN_DAY = 86400000;

export const americanToDecimal = (americanOdds: number): number => {
  if (americanOdds > 0) {
    return parseFloat((1 + (americanOdds / 100)).toFixed(2));
  } else if (americanOdds <= 0) {
    return parseFloat((1 - (100 / americanOdds)).toFixed(2));
  }
  return NaN;
}

export const decimalToAmerican = (decimalOdds: number): number => {
  if (decimalOdds >= 2) {
    return (decimalOdds - 1) * 100
  } else if (decimalOdds < 2) {
    return -100 / (decimalOdds - 1)
  }
  return NaN;
}

export const tokenAmountToString = (tokenAmount: number, decimals: number = 6, minimumFractionDigits = 2, maximumFractionDigits = 2): string => {
  maximumFractionDigits = Math.max(maximumFractionDigits, minimumFractionDigits);
  return (tokenAmount / Math.pow(10, decimals)).toLocaleString('en-US', { minimumFractionDigits: minimumFractionDigits, maximumFractionDigits: maximumFractionDigits })
}

export const numStringToNumberFormat = (str: string) => {
  let dollarUSLocale = Intl.NumberFormat('en-US');
  return dollarUSLocale.format(parseFloat(str))
}

export const usdcAmountReducedLength = (amount: number) => {
  amount = amount / Math.pow(10, 6)
  if (amount <= 999) {
    return amount.toString();
  }
  else if (amount>999 && amount<=999999999) {
    return tokenAmountToString(amount / 1000, 0, 0, 3) + "K";
  }
  else if (amount > 999999999 && amount <= 999999999999){
    return tokenAmountToString(amount / 1000000, 0, 0, 3) + "M";
  }
  else {
    return tokenAmountToString(amount / 1000000000, 0, 0, 3) + "B";
  }
}