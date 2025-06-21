/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const homePageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHomeBanner: builder.query<any, void>({
      query: () => `/slider`,
    }),
    getallCategorys: builder.query<any, void>({
      query: () => `/get-all-categories`,
    }),
  }),
});

export const { useGetHomeBannerQuery, useGetallCategorysQuery } = homePageApi;
