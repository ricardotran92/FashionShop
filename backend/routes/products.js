/*
Đối tượng Router trong Express là cơ chế cho phép chi nhỏ ứng dụng thành các phần nhỏ, mỗi phần có thể xử lý một tập hợp cụ thể các yêu cầu HTTP (như GET, POST, PUT, DELETE...). 

Routes () cho tài nguyên sản phẩm
*/

// backend/routes/products.js

import express, { application } from "express";
import {
  getProducts,
  newProduct,
  getProductDetails,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  canUserReview,
  getAdminProducts,
  uploadProductImages,
  deleteProductImage,
} from "../controllers/productControllers.js"; // tự động xuất hiện khi gõ syntax get(getProducts)
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

// Tạo một đối tượng Router của Express mới để định nghĩa các tuyến đường (routes) cho ứng dụng.
const router = express.Router();

// Router route(dẫn) đến mục "/products" để get (nhận request) và đưa vào controller function (hàm điều khiển)
router.route("/products").get(getProducts);

//Router route(dẫn) đến mục "/products" để ...
router
  .route("/admin/products")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct) // chỉ admin có thể tạo sản phẩm
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts); // chỉ admin lấy tất cả sản phẩm

//Router route(dẫn) đến mục "/products" để get thông tin 1 sản phẩm theo id cho sẵn
//router.route("/products/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getProductDetails);
router.route("/products/:id").get(getProductDetails);

//Router route(dẫn) đến mục "/products" để upload ảnh sản phẩm theo id sản phẩm
router
  .route("/admin/products/:id/upload_images")
  .put(isAuthenticatedUser, authorizeRoles("admin"), uploadProductImages);

//Router route(dẫn) đến mục "/products" để xóa ảnh sản phẩm theo id sản phẩm
router
  .route("/admin/products/:id/delete_image")
  .put(isAuthenticatedUser, authorizeRoles("admin"), deleteProductImage);

//Router route(dẫn) đến mục "/products" để sửa sản phẩm theo id sản phẩm
router.route("/admin/products/:id").put(updateProduct);

//Router route(dẫn) đến mục "/products" để xóa 1 sản phẩm theo id sản phẩm
router.route("/admin/products/:id").delete(deleteProduct);

router
  .route("/reviews")
  // Lấy đánh giá sản phẩm
  .get(isAuthenticatedUser, getProductReviews)
  // Tạo đánh giá sản phẩm
  .put(isAuthenticatedUser, createProductReview);

router
  .route("/admin/reviews")
  // Xóa đánh giá (chỉ admin)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

router
  // Kiểm tra người dùng có thể đánh giá không
  .route("/can_review")
  .get(isAuthenticatedUser, canUserReview);

// để sử dụng trong các files. Khi 1 tệp (app.js) muốn import từ 1 module khác (product.js) thì cần export dữ liệu từ module đó (tương tự return)
export default router;
