/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/redux/baseApi";

export const trendingApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    mosthartedProduct: builder.query<
      any,
      { category: string | number; region: string | number }
    >({
      query: ({ category, region }) =>
        `/most-hearted-products?category_id=${category}&region_id=${region}`,
    }),

    getproductsAds: builder.query<any, { region: string | number }>({
      query: ({ region }) =>
        `/ad-request-trending-products?region_id=${region}`,
      providesTags: ["tranding", "fevorite"],
    }),

    getmostFollowrsBrand: builder.query<any, { region: string | number }>({
      query: ({ region }) => `/most-followers-brand?region_id=${region}`,
    }),

    getSponsoredBrands: builder.query<any, { region: string | number }>({
      query: ({ region }) => `/ad-request-most-follower?region_id=${region}`,
    }),

    trendingProductDetailsById: builder.query<any, void>({
      query: (id) => `/get-product/${id}?role=3`,
      providesTags: ["tranding"],
    }),

    getWholesalerProdById: builder.query<
      any,
      { id: string; per_page: string | number; page: string | number }
    >({
      query: ({ id, per_page, page }) =>
        `/get/${id}/products?type=wholesaler&per_page=${per_page}&page=${page}`,
      providesTags: ["store", "manage"],
    }),

    storeProductDetailsById: builder.query<any, any>({
      query: (id) => `/get-product/${id}?role=5`,
      providesTags: ["tranding", "fevorite"],
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

    mostRatedReview: builder.query<any, { region: string }>({
      query: ({ region }) => `/most-rated-reviews?region_id=${region}`,
    }),

    getMostratedArtical: builder.query<
      any,
      { page: string; per_page: string; region: string | number }
    >({
      query: ({ page, per_page, region }) =>
        `/post?per_page=${per_page}&page=${page}&content_type=article&is_global=1&region_id=${region}`,
      providesTags: ["artical"],
    }),

    myartical: builder.query<any, { page: string; per_page: string }>({
      query: ({ page, per_page }) =>
        `/post?per_page=${per_page}&page=${page}&content_type=article`,
      providesTags: ["artical"],
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
      invalidatesTags: ["artical"],
    }),

    updateArtical: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/post/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["artical"],
    }),

    fevoriteUnveforite: builder.mutation<any, any>({
      query: (body) => ({
        url: `/hearted-product`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["fevorite", "brand"],
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
      invalidatesTags: ["tranding", "group"],
    }),
    deleteThread: builder.mutation<any, any>({
      query: ({ id }) => ({
        url: `/forum-thread/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tranding"],
    }),

    getGallery: builder.query<any, void>({
      query: () => `/posts/trending?limit=50`,
      providesTags: ["tranding"],
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
  useUpdateArticalMutation,
  useGetWholesalerProdByIdQuery,
  useGetGalleryQuery,
} = trendingApi;
