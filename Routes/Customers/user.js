const express = require("express");
const {
  logout,
  Otp_login,
  Otp_verification,
  customer_profile_creation,
} = require("../../helpers/customers");

const router = express.Router();

router.post(`/auth/login`, Otp_login);
router.post("/auth/otp_verification", Otp_verification);
router.post('/auth/create_profile',customer_profile_creation);
router.post(`/auth/logout`, logout);

//order admin functionality
router.get("/customer/profile");
router.get("/customer/total_orders");
router.get("/customer/cart");
router.get("/customer/whishItems");

module.exports = router;
