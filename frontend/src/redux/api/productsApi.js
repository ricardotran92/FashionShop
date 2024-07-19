/* 
ref https://redux-toolkit.js.org/rtk-query/overview
RTK Query is a data fetching and caching tool built on top of Redux Toolkit.
*/
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Product", "AdminProducts", "Reviews"], // tags để xác định khi cần invalidate cache
  // giữ data trong cache 1 ngày: https://redux-toolkit.js.org/rtk-query/usage/cache-behavior
  keepUnusedDataFor: 86400,
  // builder to access the query function, mutations, send requests
  // endpoints lấy sản phẩm từ backend
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        // đưa params về backend
        params: {
          page: params?.page, // page: số trang
          keyword: params?.keyword, // keyword: từ khóa tìm kiếm
          category: params?.category,
          subCategory: params?.subCategory, //
          subSubCategory: params?.subSubCategory, //
          sort: params?.sort,
          "price[gte]": params?.min,
          "price[lte]": params?.max,
        },
      }),
    }),
    // Lấy thông tin chi tiết sản phẩm từ backend
    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["Product"],
    }),
    // getProductById: builder.query({
    //   query: (id) => `/${id}`,
    // }),
    submitReview: builder.mutation({
      query(body) {
        return {
          url: "/reviews",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Product"],
    }),
    canUserReview: builder.query({
      query: (productId) => `/can_review/?productId=${productId}`,
    }),
    getAdminProducts: builder.query({
      query: () => `/admin/products`,
      providesTags: ["AdminProducts"],
    }),
    createProduct: builder.mutation({
      query(body) {
        return {
          url: "/admin/products",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["AdminProducts"],
    }),
    updateProduct: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Product", "AdminProducts"],
    }),
    uploadProductImages: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}/upload_images`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Product"],
    }),
    deleteProductImage: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}/delete_image`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query(id) {
        return {
          url: `/admin/products/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AdminProducts"],
    }),
    getProductReviews: builder.query({
      query: (producId) => `/reviews?id=${producId}`,
      providesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation({
      query({ productId, id }) {
        return {
          url: `/admin/reviews?productId=${productId}&id=${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Reviews"],
    }),
  }),
});

// the hook  để lấy toàn bộ sản phẩm, tất cả biến Isloading-sucess-error variables
export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useSubmitReviewMutation,
  useCanUserReviewQuery,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
  useDeleteProductMutation,
  useLazyGetProductReviewsQuery,
  useDeleteReviewMutation,
} = productApi;

// const createQueryParams = (params) => {
//   console.log(params); // In ra các tham số trước khi gửi yêu cầu

//   return {
//     url: "/products",
//     params: {
//       page: params?.page,
//       keyword: params?.keyword,
//       category: params?.category,
//       subCategory: params?.subCategory,
//       subSubCategory: params?.subSubCategory,
//       sort: params?.sort,
//       "price[gte]": params?.min,
//       "price[lte]": params?.max,
//     }
//   };
// };
