import { api } from "@/redux/baseApi";

export const brandApis = api.injectEndpoints({
  endpoints: (builder) => ({
    getallBrands: builder.query<any, void>({
      query: () => `/get-all-store-brand-wholesaler?type=brand`,
    }),
    getBrandDetailsById: builder.query<any, void>({
      query: (id) => `/get/${id}/products?type=brand`,
      providesTags: ["brand"],
    }),
    getMostHurtedBrand: builder.query<any, void>({
      query: (id) =>
        `/get/${id}/products?type=brand&is_most_hearted=1&per_page=8`,
    }),

    getBrandGroup: builder.query<any, void>({
      query: (id) => `/forum-group?show_front=1&user_id=${id}`,
    }),
  }),
});

export const {
  useGetallBrandsQuery,
  useGetBrandDetailsByIdQuery,
  useGetMostHurtedBrandQuery,
  useGetBrandGroupQuery,
} = brandApis;
