/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../baseApi";
export const  btbApi = api.injectEndpoints({
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
    btbProducts: builder.query<any,{id:number}>({
      query:({id})=>({
        url:`/b2b/product-list/${id}`,
        method:"GET",
      })
    })
  })
})

export const {useGetBtbConnectsQuery, useBtbStatusUpdateMutation, useBtbProductPricingMutation,useBtbProductsQuery} = btbApi;


