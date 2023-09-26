import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Bet, Season } from '../constants'
import { DIVVY_API, DIVVY_API_STORE_BETS } from '../constants/urls'

export const storeBetsApi = createApi({
    reducerPath: 'storeBets',
    baseQuery: fetchBaseQuery({ baseUrl: DIVVY_API }),
    endpoints: (builder) => ({
        storeBets: builder.mutation<string, Bet>({
            query(data: Bet) {
                return {
                    url: DIVVY_API_STORE_BETS,
                    method: "POST",
                    body: data,
                }
            },
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useStoreBetsMutation } = storeBetsApi