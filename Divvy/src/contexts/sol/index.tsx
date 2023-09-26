import { BetPoolStateProvider } from "./betstate"
import { BetPoolProvider } from "./betusdt"
import { HousePoolProvider } from "./hpliquidity"
import { HousePoolStateProvider } from "./hpstate"
import { HPTokenProvider } from "./hptoken"
import { UserHTContextProvider } from "./userht"
import { UserUSDCContextProvider } from "./userusdc"
import { UserGameTokenBalanceContextProvider } from "./usergametoken"

export const SolanaProvider = (props: { children: any }) => {
    return (
        <BetPoolProvider>
            <HousePoolProvider>
                <HousePoolStateProvider>
                    <HPTokenProvider>
                        <BetPoolStateProvider>
                            <UserHTContextProvider>
                                <UserUSDCContextProvider>
                                    <UserGameTokenBalanceContextProvider>
                                        {props.children}
                                    </UserGameTokenBalanceContextProvider>
                                </UserUSDCContextProvider>
                            </UserHTContextProvider>
                        </BetPoolStateProvider>
                    </HPTokenProvider>
                </HousePoolStateProvider>
            </HousePoolProvider>
        </BetPoolProvider>
    )
}