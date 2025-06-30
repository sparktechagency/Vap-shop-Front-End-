/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const trendingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    mosthartedProduct: builder.query<any, void>({
      query: () => `/most-hearted-products`,
    }),

    getproductsAds: builder.query<any, void>({
      query: () => `/ad-request-trending-products`,
    }),

    getmostFollowrsBrand: builder.query<any, void>({
      query: () => `/most-followers-brand`,
    }),

    getSponsoredBrands: builder.query<any, void>({
      query: () => `/ad-request-most-follower`,
    }),



    trendingProductDetailsById: builder.query<any, void>({
      query: (id) => `/get-product/${id}?role=3`,
      providesTags: ["tranding"],

    }),

    followBrand: builder.mutation({
      query: (id) => ({
        url: `/follow?following_id=${id}`,
        method: "POST",
        invalidatesTags: ["tranding", "brand"],
      }),

    }),

    unfollowBrand: builder.mutation({
      query: (id) => ({
        url: `/unfollow?following_id=${id}`,
        method: "POST",
        invalidatesTags: ["tranding", "brand"],
      }),
    }),

    mostRatedReview: builder.query<any, void>({
      query: () => `/most-rated-reviews`,
    }),

    getMostratedArtical: builder.query<any, { page: string; per_page: string }>({
      query: ({ page, per_page }) => `/post?per_page=${per_page}&page=${page}&content_type=article&is_global=1`,
    }),


    myartical: builder.query<any, { page: string; per_page: string }>({
      query: ({ page, per_page }) => `/post?per_page=${per_page}&page=${page}&content_type=article`,
    }),

    createApost: builder.mutation<any, any>({
      query: (formData) => ({
        url: "/post?content_type=article",
        method: "POST",
        body: formData,
      }),
    })

  }),
});

export const { useMosthartedProductQuery, useTrendingProductDetailsByIdQuery, useFollowBrandMutation, useUnfollowBrandMutation, useGetproductsAdsQuery, useGetmostFollowrsBrandQuery, useGetSponsoredBrandsQuery, useMostRatedReviewQuery, useGetMostratedArticalQuery, useMyarticalQuery, useCreateApostMutation } =
  trendingApi;
