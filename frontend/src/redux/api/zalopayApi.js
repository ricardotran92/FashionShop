import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const zalopayApi = createApi({
  reducerPath: "zalopayApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    createNewZaloPayPayment: builder.mutation({
      query(body) {
        return {
          url: "/zalopay/payment",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useCreateNewZaloPayPaymentMutation } = zalopayApi;
