import React from "react"
import { Route} from "react-router-dom"
/*
import ProductDetails from "./components/product/ProductDetails";
import Login from "./components/auth/Login"; // auto chèn khi chọn Login từ Quick Fix
import Register from "./components/auth/Register"; // auto chèn
import Profile from "./components/user/Profile"; // auto chèn
import UpdateProfile from "./components/user/UpdateProfile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UploadAvatar from "./components/user/UploadAvatar";
import UpdatePassword from "./components/user/UpdatePassword";
import Cart from "./components/cart/Cart"
import Shipping from "./components/cart/Shipping"
import ConfirmOrder from "./components/cart/ConfirmOrder";
import PaymentMethod from "./components/cart/PaymentMethod";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import MyOrders from "./components/order/MyOrders";
import OrderDetails from "./components/order/OrderDetails";
import Invoice from "./components/invoice/Invoice";
import Home from "./components/Home";
*/


import ProductDetails from "../product/ProductDetails";
import Login from "../auth/Login"; // auto chèn khi chọn Login từ Quick Fix
import Register from "../auth/Register"; // auto chèn
import Profile from "../user/Profile"; // auto chèn
import UpdateProfile from "../user/UpdateProfile";
import ProtectedRoute from "../auth/ProtectedRoute";
import UploadAvatar from "../user/UploadAvatar";
import UpdatePassword from "../user/UpdatePassword";
import Cart from "../cart/Cart"
import Shipping from "../cart/Shipping"
import ConfirmOrder from "../cart/ConfirmOrder";
import PaymentMethod from "../cart/PaymentMethod";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import MyOrders from "../order/MyOrders";
import OrderDetails from "../order/OrderDetails";
import Invoice from "../invoice/Invoice";
import Home from "../Home";


const userRoutes = () => {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/password/forgot" element={<ForgotPassword />} />
      <Route path="/password/reset/:token" element={<ResetPassword />} />

      {/* <Route path="/me/profile" element={<Profile />} /> 
      <Route path="/me/update_profile" element={<UpdateProfile />} />*/}
      <Route 
        path="/me/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />

      <Route
        path="/me/update_profile"
          element={
          <ProtectedRoute>
            <UpdateProfile/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/me/upload_avatar"
          element={
            <ProtectedRoute>
              <UploadAvatar/>
            </ProtectedRoute>
        }
      />

      <Route
        path="/me/update_password"
          element={
            <ProtectedRoute>
              <UpdatePassword/>
            </ProtectedRoute>
        }
      />
      <Route path="/cart" element={<Cart />} />
      {/**một số route cần có route cho ac đăng ký và chưa đăng ký */}
      <Route
        path="/shipping" 
          element={
            <ProtectedRoute>
              <Shipping />
            </ProtectedRoute>
            } 
      />
      <Route
        path="/confirm_order" 
          element={
            <ProtectedRoute>
              <ConfirmOrder />
            </ProtectedRoute>
            } 
      />
      <Route
        path="/payment_method" 
          element={
            <ProtectedRoute>
              <PaymentMethod />
            </ProtectedRoute>
            } 
      />
      <Route
        path="/me/orders" 
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
            } 
      />
      <Route
        path="/me/orders/:id" 
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
            } 
      />
      <Route
        path="/invoice/orders/:id" 
          element={
            <ProtectedRoute>
              <Invoice />
            </ProtectedRoute>
            } 
      />
    </>
  )
}

export default userRoutes