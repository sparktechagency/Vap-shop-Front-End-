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
      invalidatesTags: ["user"], // must match the tag in getOwnprofile
    }),
  }),
});

export const { useGetMyReviewsQuery, useUpdateUserMutation } = MyApi;
