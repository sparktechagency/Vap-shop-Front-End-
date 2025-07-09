/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const manageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    postProduct: builder.mutation<any, any>({
      query: (body) => ({
        url: `/product-manage`,
        method: "POST",
        body,
      }),
      invalidatesTags:["manage"]
    }),
    updateProduct: builder.mutation<any, any>({
      query: ({body,id}) => ({
        url: `/product-manage/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags:["manage"]
    }),
    getProducts: builder.query<any, void>({
      query: () => `/product-manage`,
      providesTags:["manage"]
    }),
    deleteProd: builder.mutation<any,any>({
      query:({id})=>({
        url:`/product-manage/${id}`,
        method:"DELETE"
      }),
      invalidatesTags:["manage"]
    })
  }),
});

export const { usePostProductMutation, useGetProductsQuery,useDeleteProdMutation,useUpdateProductMutation } = manageApi;
