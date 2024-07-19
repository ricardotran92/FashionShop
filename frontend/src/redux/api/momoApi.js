import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const momoApi = createApi({
  reducerPath: "momoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    createNewMoMoPayment: builder.mutation({
      query(body) {
        return {
          url: "/momo/payment",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useCreateNewMoMoPaymentMutation } = momoApi;
