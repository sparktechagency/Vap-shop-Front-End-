import { api } from "@/redux/baseApi"

export const homePageApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getHomeBanner: builder.query({
            query: () => `/slider`,
        })
    }),
})

export const { useGetHomeBannerQuery } = homePageApi