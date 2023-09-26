import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DIVVY_API, DIVVY_API_SOLBUST } from '../../../constants/urls';
import { PostBetsResponse, BustBet } from '../../../models/games/moonshot/bets';

export const storeBetsApi = createApi({
    reducerPath: 'storeBets',
    baseQuery: fetchBaseQuery({ baseUrl: DIVVY_API }),
    endpoints: (builder) => ({
        storeBets: builder.mutation<PostBetsResponse, BustBet>({
            query(data: BustBet) {
                return {
                    url: DIVVY_API_SOLBUST,
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
