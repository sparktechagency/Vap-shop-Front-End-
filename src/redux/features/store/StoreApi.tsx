/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";
import { Store } from "lucide-react";

export const storeApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllstore: builder.query({
            query: ({ page }) => `/get-all-store-brand-wholesaler?type=store&per_page=8&page=${page}`,
        }),
        getStoreDetailsById: builder.query<any, { id: string; page: number; per_page: number }>({
            query: ({ id, page, per_page }) => `/get/${id}/products?type=store&per_page=${per_page}&page=${page}`,
            providesTags: ["store"],
        }),
        getstoreAbout: builder.query<any, { id: string }>({
            query: (id) => `/about?user_id=${id}`,
        }),
        StoreGroupList: builder.query<any, void>({
            query: (id) => `/forum-group?user_id=${id}&show_front=1`,
        }),

        fevoritestore: builder.mutation<any, any>({
            query: (body) => ({
                url: `/favourite`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["store"],
        }),

    }),
});

export const { useGetAllstoreQuery, useGetStoreDetailsByIdQuery, useGetstoreAboutQuery, useStoreGroupListQuery, useFevoritestoreMutation } = storeApi;
