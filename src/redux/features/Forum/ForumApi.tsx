/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../baseApi";
export const forumApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getForum: builder.query<any, Record<string, string | number | boolean | undefined>>({
      query: (params) => {
        const queryString = new URLSearchParams(params as Record<string, string>).toString();
        return `/forum-group?${queryString}`;
      },
    }),


    getallThredsByGropId: builder.query({
      query: ({ page, per_page, id }) =>
        `/forum-thread/?group_id=${id}&per_page=${per_page}&page=${page}`,
      providesTags: ["thread"],
    }),

    getThreadDetailsById: builder.query({
      query: (id) => `/forum-thread/${id}`,
    }),
    createThread: builder.mutation({
      query: (body) => ({
        url: `/forum-thread`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["thread"],
    }),

    getDashboardForum: builder.query({
      query: ({ id }) => `/forum-group?&user_id=${id}`,
    }),

    createcomment: builder.mutation({
      query: (body) => ({
        url: `/forum-comment`,
        method: "POST",
        body,
      }),
    }),
    createGroup: builder.mutation({
      query: (body) => ({
        url: "/forum-group",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetForumQuery,
  useGetallThredsByGropIdQuery,
  useGetThreadDetailsByIdQuery,
  useCreatecommentMutation,
  useGetDashboardForumQuery,
  useCreateGroupMutation,
  useCreateThreadMutation,
} = forumApi;
