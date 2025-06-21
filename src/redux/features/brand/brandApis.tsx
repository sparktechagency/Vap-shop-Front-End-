import { api } from "@/redux/baseApi";

export const brandApis = api.injectEndpoints({
  endpoints: (builder) => ({
    getallBrands: builder.query<any, void>({
      query: () => `/get-all-store-brand-wholesaler?type=brand`,
    })
  }),
});

export const {
  useGetallBrandsQuery
} = brandApis;
