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
    getMyMostHearted:builder.query<any, {per:number,page:number}>({
      query: ({per,page}) => ({
        url:`/product-manage?is_most_hearted=1&per_page=${per}&page=${page}`,
      })
    }),
    getOrders:builder.query<any, void>({
      query: () => "/orders",
      providesTags:["order"]
    }),
    getOrder:builder.query<any, {id:string}>({
      query: ({id}) => ({url:`/orders/${id}`}),
      providesTags:["order"]
    }),
    updateOrderStatus: builder.mutation<any,{id:string,body:any}>({
      query:({body,id})=>({
        url:`/orders/${id}/status`,
        method:"POST",
        body
      }),
      invalidatesTags:["order"]
    }),
    getInbox: builder.query({
      query:({id})=>({
        url:`/inbox/${id}`

      }),
      providesTags:["inbox"]
    }),
    sendInbox: builder.mutation<any,any>({
      query:(body)=>({
        url:`/inbox/send-message`,
        method:"POST",
        body
      }),
      invalidatesTags:["inbox"]
    }),
    deleteInbox: builder.mutation<any,any>({
      query:({id})=>({
        url:`/inbox/delete-message/${id}`,
        method:"DELETE",
      }),
      invalidatesTags:["inbox"]
    }),
    getCheckouts : builder.query<any,void>({
      query : () => ({
        url:`/checkouts`
      }),
      providesTags:["order"]
    }),
    cancelCheckout:builder.mutation<any,{id:string}>({
      query:({id})=>({
        url:`/checkout/${id}/cancel`,
        method:"POST",
        body:{}
      }),
      invalidatesTags:["order"]
    }),
    getCheckout:builder.query<any,any>({
      query : ({id}) => ({
        url:`/checkouts/${id}`
      }),
      providesTags:["order"]
    })
  }),

});

export const { useGetMyReviewsQuery, useCancelCheckoutMutation, useUpdateUserMutation,useUpdateAboutMutation ,useGetMyMostHeartedQuery, useGetOrdersQuery, useGetOrderQuery, useUpdateOrderStatusMutation , useGetInboxQuery, useSendInboxMutation ,useDeleteInboxMutation , useGetCheckoutsQuery,useGetCheckoutQuery} = MyApi;
