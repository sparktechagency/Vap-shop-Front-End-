/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

const MeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation<any, { title: string; content: string }>({
      query: (data) => ({
        url: "/post",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["post"],
    }),

    getPosts: builder.query<any, void>({
      query: () => ({
        url: `/post`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),
    getFeed: builder.query<any, void>({
      query: () => ({
        url: `/feed`,
        method: "GET",
      }),
    }), 
    commentPost: builder.mutation<
      any,
      { post_id: string; comment: string; parent_id?: string }
    >({
      query: (data) => ({
        url: "/post-comment",
        method: "POST",
        body: data,
      }),
    }),

    getComment: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/post-comment/?post_id=${id}`,
        method: "GET",
      }),
    }),
    getPostLike: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/get-likes-by-post-id/${id}`,
        method: "GET",
      }),
      providesTags: ["post"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useCommentPostMutation,
  useGetCommentQuery,
  useGetPostLikeQuery,
  useGetFeedQuery
} = MeApi;
