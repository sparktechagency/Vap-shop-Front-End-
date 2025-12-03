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
    getProducts: builder.query<any, {page:number,per:number}>({
      query: ({page,per}) => `/product-manage?page=${page}&per_page=${per}`,
      providesTags:["manage"]
    }),
    deleteProd: builder.mutation<any,any>({
      query:({id})=>({
        url:`/product-manage/${id}`,
        method:"DELETE"
      }),
      invalidatesTags:["manage"]
    }),
    trendAdProduct: builder.mutation<any, any>({
      query:(body)=>({
        url:`/trending-ad-product`,
        method:"POST",
        body
      })
    }),
    trendAdBrand: builder.mutation<any, any>({
      query:(body)=>({
        url:`/most-followers-ad`,
        method:"POST",
        body
      })
    }),
    updateInvoiceApi: builder.mutation<any, any>({
      query:({id,body})=>({
        url:`/order/update/${id}`,
        method:"PUT",
        body
      })
    })
  }),
});

export const {useUpdateInvoiceApiMutation, usePostProductMutation, useGetProductsQuery,useDeleteProdMutation,useUpdateProductMutation , useTrendAdProductMutation ,useTrendAdBrandMutation } = manageApi;
