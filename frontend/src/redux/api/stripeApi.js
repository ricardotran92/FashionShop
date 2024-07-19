import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stripeApi = createApi({
  reducerPath: "stripeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    createNewStripePayment: builder.mutation({
      query(body) {
        return {
          url: "/stripe/payment",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useCreateNewStripePaymentMutation } = stripeApi;
