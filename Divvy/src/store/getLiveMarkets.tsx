import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Market } from '../constants'
import { DIVVY_API, DIVVY_API_GET_LIVE_MARKETS } from '../constants/urls'

// Define a service using a base URL and expected endpoints
export const liveMarketsApi = createApi({
    reducerPath: 'getLiveMarketsApi',
    baseQuery: fetchBaseQuery({ baseUrl: DIVVY_API }),
    endpoints: (builder) => ({
        getLiveMarkets: builder.query<Array<Market>, null>({
            query: () => DIVVY_API_GET_LIVE_MARKETS,
            transformResponse: (rawResult: { data: Array<Market> }, meta) => {
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
export const { useGetLiveMarketsQuery } = liveMarketsApi