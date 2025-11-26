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

    getAllAdminCategory: builder.query<any, void>({
      query: () => `/admin/category`,
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
    connectReuqestApi: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `/connected-location/add`,
        method: "POST",
        body: { store_id: id },
      }),
      invalidatesTags: ["connected"],
    }),
    connectedListApi: builder.query<any, void>({
      query: () => ({
        url: `/connected-location/get`,
      }),
      providesTags: ["connected"],
    }),
    connectReuqestListApi: builder.query<any, void>({
      query: () => ({
        url: `/incoming-connected-location/requests`,
      }),
      providesTags: ["connected"],
    }),
    connectListApi: builder.query<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `/connected-location/user/${id}`,
      }),
      providesTags: ["connected"],
    }),
    respondConnectApi: builder.mutation<
      any,
      { id: string | number; status: "accepted" | "rejected" }
    >({
      query: ({ id, status }) => ({
        url: `/connected-location/respond/${id}`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["connected"],
    }),
  }),
});

export const {
  useGetHomeBannerQuery,
  useConnectedListApiQuery,
  useGetallCategorysQuery,
  useCreateACategoryMutation,
  useDelteACategoryMutation,
  useUpdateCategoryMutation,
  useGetAllAdminCategoryQuery,
  useConnectReuqestApiMutation,
  useConnectReuqestListApiQuery,
  useRespondConnectApiMutation,
  useConnectListApiQuery,
} = homePageApi;
