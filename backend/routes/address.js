import express from "express";
import {
  getAddressData,
} from "../controllers/addressController.js";
const router = express.Router();
// Định nghĩa các route cho paypal process
router.route("/address/data").get(getAddressData);

export default router; 