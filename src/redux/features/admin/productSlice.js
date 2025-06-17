const { api } = require("../../baseApi");

const productSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getProductList: builder.query({
      query: ({ page, perPage, search }) =>
        `product-list?page=${page}&per_page=${perPage}&search=${search}`,
    }),

    // add new products
    createProduct: builder.mutation({
      query: (body) => ({
        url: `product-add`,
        method: "POST",
        body,
      }),
    }),
    // add new products
    updateproduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `product-update/${id}`,
        method: "POST",
        body: data,
      }),
    }),

    // add new products
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `product-delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProductListQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateproductMutation,
} = productSlice;
