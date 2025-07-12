/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

const MyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyReviews: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/user-latest-reviews?user_id=${id}`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: `/update-profile`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"], 
    }),
    updateAbout:builder.mutation({
      query: (body) => ({
        url: `/about`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"], 
    }),
    getMyMostHearted:builder.query<any, void>({
      query: () => "/product-manage?is_most_hearted=1",
    }),
        getOrders:builder.query<any, void>({
      query: () => "/orders",
    }),
  }),
});

export const { useGetMyReviewsQuery, useUpdateUserMutation,useUpdateAboutMutation ,useGetMyMostHeartedQuery, useGetOrdersQuery} = MyApi;
