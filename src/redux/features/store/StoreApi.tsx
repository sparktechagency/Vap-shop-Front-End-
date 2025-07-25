/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const storeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllstore: builder.query({
      query: ({ page }) =>
        `/get-all-store-brand-wholesaler?type=store&per_page=8&page=${page}`,
    }),
    getStoreDetailsById: builder.query<
      any,
      { id: string; page: number; per_page: number }
    >({
      query: ({ id, page, per_page }) =>
        `/get/${id}/products?type=store&per_page=${per_page}&page=${page}`,
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

    checkout: builder.mutation<any, any>({
      query: (body) => ({
        url: `/order-request`,
        method: "POST",
        body,
      }),
    }),

    getllstoreinMap: builder.query<any, { sw_lat: any; sw_lng: any; ne_lat: any; ne_lng: any }>({
      query: ({ sw_lat, sw_lng, ne_lat, ne_lng }) =>
        `/stores-by-location?sw_lat=${sw_lat}&sw_lng=${sw_lng}&ne_lat=${ne_lat}&ne_lng=${ne_lng}`,
    }),



  }),
});

export const {
  useGetAllstoreQuery,
  useGetStoreDetailsByIdQuery,
  useGetstoreAboutQuery,
  useStoreGroupListQuery,
  useFevoritestoreMutation,
  useCheckoutMutation,
  useGetllstoreinMapQuery
} = storeApi;
