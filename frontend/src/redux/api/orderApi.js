/* 
ref https://redux-toolkit.js.org/rtk-query/overview
RTK Query is a data fetching and caching tool built on top of Redux Toolkit.
*/
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Order", "AdminOrders"],
  endpoints: (builder) => ({
    createNewOrder: builder.mutation({
      query(body) {
        return {
          //cần hoàn thành routes/order.js và middlewares/auth.js
          url: "/orders/new",
          method: "POST",
          body,
        };
      },
    }),
    myOrders: builder.query({
      query: () => ({
        url: `/me/orders`,
      }),
    }),
    orderDetails: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,        
      }),
      providesTags: ["Order"],
    }),
    getDashboardSales: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/admin/getSales/?startDate=${startDate}&endDate=${endDate}`,
      }),
    }),
    getAdminOrders: builder.query({
      query: () => ({
        url: `/admin/orders`,        
      }),
      providesTags: ["AdminOrders"],
    }),
    updateOrder: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/orders/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation({
      query(id) {
        return {
          url: `/admin/orders/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AdminOrders"],
    }),
  }),
});

export const {
  useCreateNewOrderMutation,
  useMyOrdersQuery,
  useOrderDetailsQuery,
  useLazyGetDashboardSalesQuery, // lazy: chỉ fetch data khi cần thiết
  useGetAdminOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
