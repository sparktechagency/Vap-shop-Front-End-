/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../baseApi";
export const  adApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    postAd: builder.mutation({
        query: (body)=>({
            url:`/trending-ad-product`,
            method:"POST", 
            body
        })
    }),
        followerAd: builder.mutation({
        query: (body)=>({
            url:`/most-followers-ad`,
            method:"POST", 
            body
        })
    }),
  })
})

export const {usePostAdMutation,useFollowerAdMutation} = adApi;


