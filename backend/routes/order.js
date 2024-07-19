
import express from "express";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
import { 
  allOrders,
  deleteOrder,
  getOrderDetails,
  getSales,
  myOrders,
  newOrder, 
  updateOrder
} from "../controllers/orderControllers.js";
const router = express.Router();
// Định nghĩa các route cho việc quản lý đơn hàng
router.route("/orders/new").post(isAuthenticatedUser, newOrder);
router.route("/orders/:id").get(isAuthenticatedUser, getOrderDetails);
router.route("/me/orders").get(isAuthenticatedUser, myOrders);
// Route chỉ dành cho admin để lấy số Sales
router
  .route("/admin/getSales")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSales);
// Route chỉ dành cho admin để quản lý tất cả các đơn hàng
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allOrders);
// Route chỉ dành cho admin để cập nhật hoặc xóa đơn hàng theo ID
router
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

  export default router; 