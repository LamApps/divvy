import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Bet, Season } from '../constants'
import { DIVVY_API, DIVVY_API_GET_BETS } from '../constants/urls'

// Define a service using a base URL and expected endpoints
export const betsApi = createApi({
    reducerPath: 'getBets',
    baseQuery: fetchBaseQuery({ baseUrl: DIVVY_API }),
    endpoints: (builder) => ({
        getBets: builder.query<Array<Bet>, string | null | undefined>({
            query: (userAddr: string | null | undefined) => DIVVY_API_GET_BETS + userAddr,
            transformResponse: (rawResult: { data: Array<Bet> }, meta) => {
                //                                                        ^
                // The optional `meta` property is available based on the type for the `baseQuery` used

                // The return value for `transformResponse` must match `ResultType`
                return rawResult.data
            },
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetBetsQuery } = betsApi