import express from "express";
import { authorizeRoles, isAuthenticatedUser, isAuthenticatedServer } from "../middlewares/auth.js";
import {
  newZaloPayPayment,
  newOrderWithZaloPay,
} from "../controllers/zalopayController.js";
const router = express.Router();
// Định nghĩa các route cho zalopay process
router.route("/zalopay/payment").post(isAuthenticatedUser, newZaloPayPayment);
router.route("/zalopay/callback").post(newOrderWithZaloPay);

export default router; 