/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const trendingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    mosthartedProduct: builder.query<any, void>({
      query: () => `/most-hearted-products`,
    }),
    trendingProductDetailsById: builder.query<any, void>({
      query: (id) => `/get-product/${id}?role=3`,
    }),
  }),
});

export const { useMosthartedProductQuery, useTrendingProductDetailsByIdQuery } =
  trendingApi;
