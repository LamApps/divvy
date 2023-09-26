import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Sports } from '../constants/Sports'
import { DIVVY_API, DIVVY_API_GET_SPORTS } from '../constants/urls'

// Define a service using a base URL and expected endpoints
export const sportsApi = createApi({
    reducerPath: 'getSportsApi',
    baseQuery: fetchBaseQuery({ baseUrl: DIVVY_API }),
    endpoints: (builder) => ({
        getSports: builder.query<Array<Sports>, null>({
            query: () => DIVVY_API_GET_SPORTS,
            transformResponse: (rawResult: { data: Array<Sports> }, meta) => {
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
export const { useGetSportsQuery } = sportsApi