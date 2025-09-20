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
    adPriceSet: builder.mutation({
        query: (body)=>({
            url:`/admin/ad-pricings`,
            method:"POST", 
            body
        })
    }),
getAdPricing: builder.query<any, {adId:string, catId: string; regionId: string }>({
  query: ({adId, catId, regionId }) => ({
    url: `/admin/ad-pricings?ad_slot_id=${adId}&category_id=${catId}&region_id=${regionId}`,
  }),
}),

  })
})

export const {usePostAdMutation,useFollowerAdMutation,useGetAdPricingQuery,useAdPriceSetMutation} = adApi;


