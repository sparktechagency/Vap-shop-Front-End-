import { api } from "@/redux/baseApi";


export const chatApi = api.injectEndpoints({
    endpoints: (builder) => ({
        searchuser: builder.query({
            query: ({ search }) => `search-new-user?search=${search}`,
        }),

        sendMessage: builder.mutation<any, any>({
            query: (body) => ({
                url: `/send-message`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["message"],
        }),

        getAllmesageByid: builder.query({
            query: ({ page, per_page, id }) => `/get-message?receiver_id=${id}&per_page=${per_page}&page=${page}`,
            providesTags: ["message"],
        }),

        getChatlist: builder.query<any, void>({
            query: () => `/chat-list`,
            providesTags: ["message"],
        }),

    }),
});

export const { useSearchuserQuery, useSendMessageMutation, useGetAllmesageByidQuery, useGetChatlistQuery } = chatApi;
