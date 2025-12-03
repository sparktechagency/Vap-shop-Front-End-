/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../baseApi";

const AuthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    Login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    register: builder.mutation({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    // it will take otp
    verifyemail: builder.mutation({
      query: (body) => ({
        url: `/verify-email`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    //it will take a email to varify
    resendotp: builder.mutation({
      query: (body) => ({
        url: `/resend-otp`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    createNewpassword: builder.mutation({
      query: (formdata) => ({
        url: `/reset-password`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["user"],
    }),
    updatePass: builder.mutation({
      query: (body) => ({
        url: `/update-password`,
        method: "POST",
        body,
      }),
    }),

    countys: builder.query<any, void>({
      query: () => ({
        url: `/get-all-countries`,
        method: "GET",
      }),
      providesTags: ["tranding"],
    }),

    createCounty: builder.mutation<any, { name: string }>({
      query: ({ name }) => ({
        url: `/admin/country`,
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["tranding"],
    }),
    updateCounty: builder.mutation<any, { id: string; name: string }>({
      query: ({ id, name }) => ({
        url: `/admin/country/${id}`,
        method: "POST",
        body: { name, _method: "PUT" },
      }),
      invalidatesTags: ["tranding"],
    }),

    deleteCountry: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/country/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tranding"],
    }),

    getAllAdminRegions: builder.query<any, void>({
      query: () => ({
        url: `/admin/region`,
        method: "GET",
      }),
      providesTags: ["tranding"],
    }),

    //getLogin user
    getOwnprofile: builder.query<any, void>({
      query: () => ({
        url: `/me`,
        method: "GET",
      }),
      providesTags: ["user", "brand"],
      keepUnusedDataFor: 0,
    }),
    getProfile: builder.query<any, { id: any }>({
      query: ({ id }) => ({
        url: `/profile/${id}`,
        method: "GET",
      }),
      providesTags: ["user", "brand"],
    }),

    getFavourite: builder.query({
      query: (typeID) => ({
        url: `/favourite?role=${typeID}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    toggleProductFavouriteApi: builder.query({
      query: (typeID) => ({
        url: `/favourite?role=${typeID}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    gtStoreDetails: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/profile/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyemailMutation,
  useResendotpMutation,
  useCreateNewpasswordMutation,
  useGetOwnprofileQuery,
  useGetProfileQuery,
  useCountysQuery,
  useGetFavouriteQuery,
  useUpdatePassMutation,
  useGtStoreDetailsQuery,
  useGetAllAdminRegionsQuery,
  useCreateCountyMutation,
  useDeleteCountryMutation,
  useUpdateCountyMutation,
} = AuthApi;
