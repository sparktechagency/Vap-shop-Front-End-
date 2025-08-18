/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const homePageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHomeBanner: builder.query<any, void>({
      query: () => `/slider`,
    }),
    getallCategorys: builder.query<any, void>({
      query: () => `/get-all-categories`,
      providesTags: ["category"],
    }),

    createACategory: builder.mutation<any, any>({
      query: (formData) => ({
        url: `/admin/category`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["category"],
    }),

    delteACategory: builder.mutation<any, any>({
      query: (id) => ({
        url: `/admin/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),

    updateCategory: builder.mutation<any, any>({
      query: ({ formData, id }) => ({
        url: `/admin/category/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["category"],
    }),


  }),
});

export const { useGetHomeBannerQuery, useGetallCategorysQuery, useCreateACategoryMutation, useDelteACategoryMutation, useUpdateCategoryMutation } = homePageApi;
