/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const storeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllstore: builder.query({
            query: ({ page, per_page }) => `/get-all-products?role=5&per_page=${per_page}&page=${page}`,
        }),
        getStoreDetailsById: builder.query<any, { id: string; page: number; per_page: number }>({
            query: ({ id, page, per_page }) => `/get/${id}/products?type=store&per_page=${per_page}&page=${page}`,
            providesTags: ["store"],
        }),
        getstoreAbout: builder.query<any, { id: string }>({
            query: (id) => `/about?user_id=${id}`,
        })
    }),
});

export const { useGetAllstoreQuery, useGetStoreDetailsByIdQuery, useGetstoreAboutQuery } = storeApi;
