/* store.js trong Redux Toolkit cấu hình Redux store, lưu trữ toàn bộ trạng thái ứng dụng.
 */
import { configureStore } from "@reduxjs/toolkit"; // ref: https://redux-toolkit.js.org/api/configureStore
import userReducer from "./features/userSlice";
import { productApi } from "./api/productsApi"; // auto chèn khi chọn productAPi
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import cartReducer from "./features/cartSlice";
import { orderApi } from "./api/orderApi";

import { zalopayApi } from "./api/zalopayApi";
import { stripeApi } from "./api/stripeApi";
import { momoApi } from "./api/momoApi";
import { paypalApi } from "./api/paypalApi";
import { addressApi } from "./api/addressApi";
import reviewReducer from "./features/reviewSlice";

export const store = configureStore({
  // Dùng Chome extension Redux DevTools để theo dõi các reducers và trạng thái của ứng dụng
  reducer: {
    // Define a top-level state field named `todos`, handled by `todosReducer`. Mặc dù userApi vẫn có thông tin user ở userApi/queries/getme/data, nhưng userReducer sẽ xử lý trạng thái của user ở userSlice ở trường state tách biệt
    auth: userReducer,
    // Định nghĩa các reducers. cartReducer xử lý trạng thái của giỏ hàng
    cart: cartReducer,

    review: reviewReducer,
    // API slices xử lý trạng thái của các yêu cầu API ứng dụng
    [productApi.reducerPath]: productApi.reducer, // ref: https://redux-toolkit.js.org/rtk-query/usage#adding-the-api-to-the-store
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [zalopayApi.reducerPath]: zalopayApi.reducer,
    [stripeApi.reducerPath]: stripeApi.reducer,
    [momoApi.reducerPath]: momoApi.reducer,
    [paypalApi.reducerPath]: paypalApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
  },
  // ref: https://redux-toolkit.js.org/rtk-query/usage#adding-the-api-middleware
  // thêm các middleware từ các API slices vào chuỗi middleware mặc định của Redux toolkit. Cho phép các AP slices xử lý các yêu cầu API và cập nhật trạng thái ứng dụng
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productApi.middleware,
      authApi.middleware,
      userApi.middleware,
      orderApi.middleware,
      zalopayApi.middleware,
      stripeApi.middleware,
      momoApi.middleware,
      paypalApi.middleware,
      addressApi.middleware,
    ]),
});
