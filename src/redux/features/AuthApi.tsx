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
    }),

    //getLogin user
    getOwnprofile: builder.query<any, void>({
      query: () => ({
        url: `/me`,
        method: "GET",
      }),
      providesTags: ["user", "brand"],
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
} = AuthApi;
