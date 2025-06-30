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
    }),
    getProducts: builder.query<any, void>({
      query: () => `/product-manage`,
    }),
  }),
});

export const { usePostProductMutation, useGetProductsQuery } = manageApi;
