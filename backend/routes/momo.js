import express from "express";
import { authorizeRoles, isAuthenticatedUser, isAuthenticatedServer } from "../middlewares/auth.js";
import {
  newMoMoPayment,
  newOrderWithMoMo,
} from "../controllers/momoController.js";
const router = express.Router();
// Định nghĩa các route cho zalopay process
router.route("/momo/payment").post(isAuthenticatedUser, newMoMoPayment);
router.route("/momo/callback").post(newOrderWithMoMo);

export default router; 