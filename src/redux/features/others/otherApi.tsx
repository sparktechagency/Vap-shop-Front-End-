/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const otherApi = api.injectEndpoints({
  overrideExisting: true,
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
      invalidatesTags: ["post"],
    }),
    search: builder.query<
      any,
      { search: string; type: string; region?: string }
    >({
      query: ({ search, type, region }) => ({
        url: `/search?search_term=${search}&type=${type}&per_page=8${
          region ? `&region_id=${region}` : ""
        }`,
      }),
    }),
    createConnect: builder.mutation({
      query: (body) => ({
        url: `/connected-location`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["location"],
    }),
    getLocations: builder.query<any, void>({
      query: () => ({
        url: `/branches`,
      }),
      providesTags: ["location"],
    }),
    cancelConnect: builder.mutation({
      query: ({ id }) => ({
        url: `/branches/${id}/cancel`,
        method: "DELETE",
      }),
      invalidatesTags: ["location"],
    }),
    getActiveLocations: builder.query({
      query: ({ id, page }) => ({
        url: `/users/${id}/active-branches?per_page=16&page=${page ?? 1}`,
      }),
      providesTags: ["location", "connected"],
    }),
    createRegion: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/admin/region`,
          method: "POST",
          body: data,
        };
      },
    }),
    editRegion: builder.mutation<any, any>({
      query: ({ id, data }) => {
        return {
          url: `/admin/region/${id}`,
          method: "POST",
          body: data,
        };
      },
    }),
    deleteRegion: builder.mutation<any, any>({
      query: ({ id }) => {
        return {
          url: `/admin/region/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useCreateRegionMutation,
  useEditRegionMutation,
  useDeleteRegionMutation,
  useGetCountriesQuery,
  useGetReviewsQuery,
  usePostReviewMutation,
  useToggleLikeMutation,
  useReplyReviewMutation,
  usePostLikeMutation,
  useSearchQuery,
  useCreateConnectMutation,
  useGetLocationsQuery,
  useCancelConnectMutation,
  useGetActiveLocationsQuery,
} = otherApi;
