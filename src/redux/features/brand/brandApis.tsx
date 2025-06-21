import { api } from "@/redux/baseApi";

export const brandApis = api.injectEndpoints({
  endpoints: (builder) => ({
    // followOrUnfollowBrand: builder.mutation({
    //   query: (id) => ({
    //     url: `/follow?following_id=${id}`,
    //     method: "POST",
    //   }),
    // }),
  }),
});

export const {
  // useFollowOrUnfollowBrandMutation
} = brandApis;
