/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const notifApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifs: builder.query<any,{page:string|number}>({
      query: ({ page }) =>
        `/notifications?page=${page}`,
    providesTags:["notification"]
    }),
    readNotif: builder.mutation({
        query:({id})=>({
            url:`/notifications/${id}/read`,
            method:"PATCH"
        }),
    invalidatesTags:["notification"]
    }),
    readNotifAll: builder.mutation<any,void>({
    query:()=>({
        url:`/notifications/mark-all-as-read`,
        method:"POST"
    }),
    invalidatesTags:["notification"]
    })
  }),
});

export const {
  useGetNotifsQuery,
  useReadNotifMutation,
  useReadNotifAllMutation
} = notifApi;
