import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Market } from '../constants'
import { DIVVY_API, DIVVY_API_COMMENCED_MARKETS } from '../constants/urls'

// Define a service using a base URL and expected endpoints
export const commencedMarketsApi = createApi({
    reducerPath: 'getCommnecedMarkets',
    baseQuery: fetchBaseQuery({ baseUrl: DIVVY_API }),
    endpoints: (builder) => ({
        getCommencedMarkets: builder.query<Array<Market>, null>({
            query: () => DIVVY_API_COMMENCED_MARKETS,
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
export const { useGetCommencedMarketsQuery } = commencedMarketsApi