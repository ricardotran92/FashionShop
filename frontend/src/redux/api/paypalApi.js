import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paypalApi = createApi({
  reducerPath: "paypalApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    createNewPaypalPayment: builder.mutation({
      query(body) {
        return {
          url: "/paypal/payment",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useCreateNewPaypalPaymentMutation } = paypalApi;
