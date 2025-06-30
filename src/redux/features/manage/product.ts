/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const manageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    postProduct: builder.query<any, void>({
      query: () => ({
        url: `/product-manage`,
        method: "POST",
      }),
    }),
  }),
});

export const { useGetHomeBannerQuery } = manageApi;
