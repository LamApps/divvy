import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Pool, Transactions } from '../constants/bets'
import { DIVVY_API, DIVVY_API_GET_TRANS } from '../constants/urls'

// Define a service using a base URL and expected endpoints
export const transactionsApi = createApi({
    reducerPath: 'getTransactions',
    baseQuery: fetchBaseQuery({ baseUrl: DIVVY_API }),
    endpoints: (builder) => ({
        getTransactions: builder.query<Array<Transactions>, string | null | undefined>({
            query: () => DIVVY_API_GET_TRANS,
            transformResponse: (rawResult: { data: Array<Transactions> }, meta) => {
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
export const { useGetTransactionsQuery } = transactionsApi