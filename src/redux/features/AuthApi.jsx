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
    verifyemail: builder.mutation({
      query: ({ otp, body = {} }) => ({
        url: `/verify-email?otp=${otp}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    resetpassword: builder.mutation({
      query: ({ email, body = {} }) => ({
        url: `/resentOtp?email=${email}`,
        method: "POST",
        body: body,
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

    getOwnprofile: builder.query({
      query: () => ({
        url: `/user`,
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
  useResetpasswordMutation,
  useCreateNewpasswordMutation,
  useGetOwnprofileQuery,
} = AuthApi;
