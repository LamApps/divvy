import { blob, nu64, seq, struct, u8 } from "buffer-layout";

export const MARKET_SIDE_LAYOUT = struct([
  u8("oddsFeedAccountExists"),
  blob(32, "oddsFeedAccount"),
  u8("pointsFeedAccountExists"),
  blob(32, "pointsFeedAccount"),
  nu64("payout"),
  nu64("risk"),
]);

export const MARKET_STATE_ACCOUNT_DATA_LAYOUT = struct([
  blob(1, "isInitialized"),
  blob(246, "marketSides"),
  blob(8, "lockedLiquidity"),
  blob(32, "resultFeed"),
  u8("result"),
  blob(8, "bettorBalance"),
  blob(8, "pendingBets"),
  blob(2, "teamAScore"),
  blob(2, "teamBScore"),
  blob(2, "totalScore"),
]);