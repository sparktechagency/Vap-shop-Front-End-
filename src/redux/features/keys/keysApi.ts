/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const keysApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPGKeys: builder.query<any, void>({
      query: () => `/get-payment-gateway-credentials`,
    }),
    postPGKeys:builder.mutation({
        query:(body)=>({
            url:`/update-payment-gateway-credentials`,
            method:"POST",
            body

        })
    })
  }),
});

export const { useGetPGKeysQuery, usePostPGKeysMutation} = keysApi;
