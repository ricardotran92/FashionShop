/* /login là post request (mutation, thay vì query) gửi đến backend, backend xử lý và trả về response
https://redux-toolkit.js.org/rtk-query/usage/mutations

useLoginMutation là hook được tạo bởi Redux Toolkit Query (RTK Query) từ endpoint login trong authApi. Endpoint này gửi 1 request POST đến /api/login với credentials (email, password) và trả về response.
Khi đăng nhập sẽ dùng lệnh POST thay vì GET vì dữ liệu credentials không nên hiển thị trên URL.
*/ 
import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { userApi } from './userApi';

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  // giữ data trong cache 1 ngày: https://redux-toolkit.js.org/rtk-query/usage/cache-behavior
  keepUnusedDataFor: 86400,
  // builder to access the query function (GET), mutations (POST, PUT, PATCH, DELETE), send requests
  // endpoints để gửi request đến backend
  endpoints: (builder) => ({ 
    // Register mutation
    register: builder.mutation({
      query(body) {
        return{
          url: "/register",
          method: "POST",
          body,
        }
      },
      // authenticate user after register
      async onQueryStarted(args, { dispatch, queryFulfilled}) {
        try {
          await queryFulfilled;
          await dispatch(userApi.endpoints.getMe.initiate(null)); // gọi endpoint getMe từ userApi để lấy thông tin user sau khi login
        } catch (error) {
          console.log(error);
        }
      },
    }),    
    // mutation để login
    login: builder.mutation({
      query(body) {
        return{
          url: "/login",
          method: "POST",
          body,
        }
      },
      // authenticate user after login
      async onQueryStarted(args, { dispatch, queryFulfilled}) {
        try {
          await queryFulfilled;
          await dispatch(userApi.endpoints.getMe.initiate(null)); // gọi endpoint getMe từ userApi để lấy thông tin user sau khi login
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logout: builder.query({
      query: () => "/logout",
    })
  }),
})

// the hook để lấy toàn bộ sản phẩm, tất cả biến Isloading-sucess-error variables
export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery } = authApi;

// const { data } = useLogoutQuery(); // Khi reload (F5) là tự log out