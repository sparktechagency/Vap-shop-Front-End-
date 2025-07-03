/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const storeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllstore: builder.query({
            query: ({ page, per_page }) => `/get-all-products?role=5&per_page=${per_page}&page=${page}`,
        }),
        getStoreDetailsById: builder.query<any, void>({
            query: (id) => `/get/${id}/products?type=store`,
            providesTags: ["store"],
        }),
    }),
});

export const { useGetAllstoreQuery, useGetStoreDetailsByIdQuery } = storeApi;
