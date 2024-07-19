import express from "express";
import { authorizeRoles, isAuthenticatedUser, isAuthenticatedServer } from "../middlewares/auth.js";
import {
  newPaypalPayment,
  newOrderWithPaypal,
} from "../controllers/paypalController.js";
const router = express.Router();
// Định nghĩa các route cho paypal process
router.route("/paypal/payment").post(isAuthenticatedUser, newPaypalPayment);
router.route("/paypal/order").post(newOrderWithPaypal);

export default router; 