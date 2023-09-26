import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Season } from '../constants'
import { DIVVY_API, DIVVY_API_GET_SEASONS } from '../constants/urls'

// Define a service using a base URL and expected endpoints
export const seasonsApi = createApi({
    reducerPath: 'getSeasonsApi',
    baseQuery: fetchBaseQuery({ baseUrl: DIVVY_API }),
    endpoints: (builder) => ({
        getSeasons: builder.query<Array<Season>, number>({
            query: (sportId: number) => DIVVY_API_GET_SEASONS + String(sportId),
            transformResponse: (rawResult: { data: Array<Season> }, meta) => {
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
export const { useGetSeasonsQuery } = seasonsApi