/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const otherApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<any, void>({
      query: () => `/get-all-countries`,
    }),
    getReviews: builder.query<any, { role: number; id: number }>({
      query: ({ role, id }) => ({
        url: `/product-review?role=${role}&product_id=${id}`,
      }),
      providesTags: (result, error, { id }) => [{ type: "review", id }],
    }),
    postReview: builder.mutation<any, any>({
      query: (body) => ({
        url: `/product-review`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { product_id }) => [
        { type: "review", id: product_id },
      ],
    }),
    replyReview: builder.mutation<any, any>({
      query: (body) => ({
        url: `/product-review`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["review"],
    }),
    toggleLike: builder.mutation<any, any>({
      query: ({ id }) => ({
        url: `/reviews/${id}/toggle-like`,
        method: "POST",
      }),
    }),
    postLike: builder.mutation<any, any>({
      query: ({ id }) => ({
        url: `/tigger-like/${id}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetReviewsQuery,
  usePostReviewMutation,
  useToggleLikeMutation,
  useReplyReviewMutation,
  usePostLikeMutation,
} = otherApi;
