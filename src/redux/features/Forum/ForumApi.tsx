import { api } from "../../baseApi";
export const forumApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getForum: builder.query<any, void>({
      query: () => `/forum-group?show_front=1`,
    }),

    getallThredsByGropId: builder.query({
      query: ({ page, per_page, id }) => `/forum-thread/?group_id=${id}&per_page=${per_page}&page=${page}`,
    }),

    getThreadDetailsById: builder.query({
      query: (id) => `/forum-thread/${id}`,
    }),

    createcomment: builder.mutation({
      query: (body) => ({
        url: `/forum-comment`,
        method: "POST",
        body,
      }),
    })
  }),
});

export const { useGetForumQuery, useGetallThredsByGropIdQuery, useGetThreadDetailsByIdQuery, useCreatecommentMutation } = forumApi;
