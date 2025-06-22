/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const trendingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    mosthartedProduct: builder.query<any, void>({
      query: () => `/most-hearted-products`,
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
    })
  }),
});

export const { useMosthartedProductQuery, useTrendingProductDetailsByIdQuery, useFollowBrandMutation, useUnfollowBrandMutation } =
  trendingApi;
