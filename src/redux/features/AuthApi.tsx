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
      providesTags: ["user"],
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
  useCountysQuery,
} = AuthApi;
