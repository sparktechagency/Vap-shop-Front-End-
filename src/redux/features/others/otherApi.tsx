/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const otherApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<any, void>({
      query: () => `/get-all-countries`,
    }),
  }),
});

export const { useGetCountriesQuery } = otherApi;
