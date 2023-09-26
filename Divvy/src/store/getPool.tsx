import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Pool } from '../constants/bets'
import { DIVVY_API, DIVVY_API_GET_POOL } from '../constants/urls'

// Define a service using a base URL and expected endpoints
export const poolApi = createApi({
    reducerPath: 'getPool',
    baseQuery: fetchBaseQuery({ baseUrl: DIVVY_API }),
    endpoints: (builder) => ({
        getPool: builder.query<Array<Pool>, string | null | undefined>({
            query: (interval : string | null) => DIVVY_API_GET_POOL+interval,
            transformResponse: (rawResult: { data: Array<Pool> }, meta) => {
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
export const { useGetPoolQuery } = poolApi