import * as BufferLayout from "buffer-layout";
import * as Layout from "../../../utils/layout";

export const BUST_BET_ACCOUNT = BufferLayout.struct([
    Layout.publicKey('user_main_pubkey'),
    Layout.publicKey('user_usdt_pubkey'),
    BufferLayout.u16("risk"),
    BufferLayout.u32("user_multiplier"),
    BufferLayout.u32('actual_multiplier'),
  ]);