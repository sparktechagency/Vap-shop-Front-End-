/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../baseApi";
export const  btbApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBtbConnects: builder.query({
        query: ({page,per})=>({
            url:`/b2b/requests/incoming?page=${page}&per_page=${per}`
        })
    }),
    btbStatusUpdate: builder.mutation<any,{id:string|number,status:string}>({
      query:({id,status})=>({
        url:`/b2b/request/${id}/update?status=${status}`,
        method:"PUT",
        body:{}
      })
    }),
    btbProductPricing: builder.mutation<any,{body:any}>({
      query:({body})=>({
        url:`/b2b/product-pricing`,
        method:"POST",
        body
      })
    }),
    btbProducts: builder.query<any,{id:string|number}>({
      query:({id})=>({
        url:`/b2b/seller-product-list/${id}`,
        method:"GET",
      })
    }),
    myBtbProducts: builder.query<any,void>({
      query:()=>({
        url:`/b2b/get-product-list`,
        method:"GET",
      }),
      providesTags: ["btb","manage"],
    }),
    sendBtbRequest: builder.mutation<any,{id:string|number}>({
      query:({id})=>({
        url:`/b2b/request/${id}`,
        method:"POST",
        body:{}
      })
    }),
    btbCheckout: builder.mutation<any,any>({
      query:(body)=>({
        url:`/b2b/checkout`,
        method:"POST",
        body
      })
    }),
    btbDeleteProduct: builder.mutation<any,{id:string|number}>({
      query:({id})=>({
        url:`/b2b/product-pricing/${id}`,
        method:"DELETE",
      }),
      invalidatesTags: ["btb","manage"],
    }),
  })
})

export const {useGetBtbConnectsQuery, useBtbStatusUpdateMutation, useBtbProductPricingMutation,useBtbProductsQuery,useMyBtbProductsQuery, useSendBtbRequestMutation,useBtbDeleteProductMutation, useBtbCheckoutMutation} = btbApi;


