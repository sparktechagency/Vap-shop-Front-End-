/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../baseApi";
export const forumApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getForum: builder.query<
      any,
      Record<string, string | number | boolean | undefined>
    >({
      query: (params) => {
        const queryString = new URLSearchParams(
          params as Record<string, string>
        ).toString();
        return `/forum-group?${queryString}`;
      },
    }),

    getallThredsByGropId: builder.query({
      query: ({ page, per_page, id }) =>
        `/forum-thread/?group_id=${id}&per_page=${per_page}&page=${page}`,
      providesTags: ["thread"],
    }),
    getGroup: builder.query<any, { id: string | number }>({
      query: ({ id }) => `/forum-group/${id}`,
      providesTags: ["thread"],
    }),

    getThreadDetailsById: builder.query({
      query: (id) => `/forum-thread/${id}`,
      providesTags: ["thread"],
    }),
    createThread: builder.mutation({
      query: (body) => ({
        url: `/forum-thread`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["thread"],
    }),
    updateThread: builder.mutation({
      query: ({ body, id }) => ({
        url: `/forum-thread/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["thread"],
    }),
    deleteThread: builder.mutation({
      query: ({ id }) => ({
        url: `/forum-thread/${id}`,
        method: "DELETE",
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

    likeThread: builder.mutation({
      query: ({ id }) => ({
        url: `/forum-thread/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: ["thread"],
    }),
    likeComment: builder.mutation({
      query: ({ id }) => ({
        url: `/forum-comment/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: ["thread"],
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
  useLikeThreadMutation,
  useLikeCommentMutation,
  useUpdateThreadMutation,
  useDeleteThreadMutation,
  useGetGroupQuery,
} = forumApi;
