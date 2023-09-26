import { TokenAccount } from "../models";
import { useAccountsContext } from "../contexts/sol/accounts";

export function useUserAccounts() {
  const context = useAccountsContext();
  return {
    userAccounts: context.userAccounts as TokenAccount[],
  };
}
