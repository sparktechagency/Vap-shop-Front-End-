/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const storeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllstore: builder.query({
      query: ({ page }) =>
        `/get-all-store-brand-wholesaler?type=store&per_page=16&page=${page}`,
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

    getAllStoresInMap: builder.query<
      any,
      {
        sw_lat?: number;
        sw_lng?: number;
        ne_lat?: number;
        ne_lng?: number;
        latitude?: number;
        longitude?: number;
        radius?: number;
      }
    >({
      query: ({
        sw_lat,
        sw_lng,
        ne_lat,
        ne_lng,
        latitude,
        longitude,
        radius,
      }) => {
        const params = new URLSearchParams();

        if (sw_lat) params.append("sw_lat", sw_lat.toString());
        if (sw_lng) params.append("sw_lng", sw_lng.toString());
        if (ne_lat) params.append("ne_lat", ne_lat.toString());
        if (ne_lng) params.append("ne_lng", ne_lng.toString());
        if (latitude) params.append("latitude", latitude.toString());
        if (longitude) params.append("longitude", longitude.toString());
        if (radius) params.append("radius", radius.toString());

        return `/stores-by-location?${params.toString()}`;
      },
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
  useGetAllStoresInMapQuery,
} = storeApi;
