import express from "express";
import { authorizeRoles, isAuthenticatedUser, isAuthenticatedServer } from "../middlewares/auth.js";
import {
  newStripePayment,
  newOrderWithStripe,
} from "../controllers/stripeController.js";
const router = express.Router();
// Định nghĩa các route cho stripe process
router.route("/stripe/payment").post(isAuthenticatedUser, newStripePayment);
router.route("/stripe/callback").post(newOrderWithStripe);

export default router; 