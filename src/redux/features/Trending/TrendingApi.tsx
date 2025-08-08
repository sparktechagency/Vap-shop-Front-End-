/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const trendingApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    mosthartedProduct: builder.query<any, void>({
      query: () => `/most-hearted-products`,
    }),

    getproductsAds: builder.query<any, void>({
      query: () => `/ad-request-trending-products`,
      providesTags: ["tranding", "fevorite"],
    }),

    getmostFollowrsBrand: builder.query<any, void>({
      query: () => `/most-followers-brand`,
    }),

    getSponsoredBrands: builder.query<any, void>({
      query: () => `/ad-request-most-follower`,
    }),

    trendingProductDetailsById: builder.query<any, void>({
      query: (id) => `/get-product/${id}?role=3`,
      providesTags: ["tranding"],
    }),
    storeProductDetailsById: builder.query<any, any>({
      query: (id) => `/get-product/${id}?role=5`,
      providesTags: ["tranding"],
    }),
    productDetailsByIdRole: builder.query<
      any,
      { id: string | number; role: number | string }
    >({
      query: ({ id, role }) => `/get-product/${id}?role=${role}`,
      providesTags: ["tranding"],
    }),

    followBrand: builder.mutation({
      query: (id) => ({
        url: `/follow?following_id=${id}`,
        method: "POST",
        invalidatesTags: ["tranding", "brand"],
      }),
    }),

    unfollowBrand: builder.mutation({
      query: (id) => ({
        url: `/unfollow?following_id=${id}`,
        method: "POST",
        invalidatesTags: ["tranding", "brand"],
      }),
    }),

    mostRatedReview: builder.query<any, void>({
      query: () => `/most-rated-reviews`,
    }),

    getMostratedArtical: builder.query<any, { page: string; per_page: string }>(
      {
        query: ({ page, per_page }) =>
          `/post?per_page=${per_page}&page=${page}&content_type=article&is_global=1`,
      }
    ),

    myartical: builder.query<any, { page: string; per_page: string }>({
      query: ({ page, per_page }) =>
        `/post?per_page=${per_page}&page=${page}&content_type=article`,
    }),

    getArtialByid: builder.query<any, { id: any }>({
      query: ({ id }) => `/post/${id}?content_type=article`,
      providesTags: ["artical"],
    }),

    createArtical: builder.mutation({
      query: (formData) => ({
        url: "/post-comment",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["artical"],
    }),

    createApost: builder.mutation<any, any>({
      query: (formData) => ({
        url: "/post?content_type=article",
        method: "POST",
        body: formData,
      }),
    }),

    fevoriteUnveforite: builder.mutation<any, any>({
      query: (body) => ({
        url: `/hearted-product`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["fevorite"],
    }),

    delteArtical: builder.mutation<any, any>({
      query: ({ id }) => ({
        url: `/post/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["artical"],
    }),
    deleteGroup: builder.mutation<any, any>({
      query: ({ id }) => ({
        url: `/forum-group/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tranding"],
    }),
    deleteThread: builder.mutation<any, any>({
      query: ({ id }) => ({
        url: `/forum-thread/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tranding"],
    }),
  }),
});

export const {
  useMosthartedProductQuery,
  useTrendingProductDetailsByIdQuery,
  useFollowBrandMutation,
  useUnfollowBrandMutation,
  useGetproductsAdsQuery,
  useGetmostFollowrsBrandQuery,
  useGetSponsoredBrandsQuery,
  useMostRatedReviewQuery,
  useGetMostratedArticalQuery,
  useMyarticalQuery,
  useCreateApostMutation,
  useFevoriteUnveforiteMutation,
  useStoreProductDetailsByIdQuery,
  useGetArtialByidQuery,
  useCreateArticalMutation,
  useProductDetailsByIdRoleQuery,
  useDelteArticalMutation,
  useDeleteGroupMutation,
} = trendingApi;
