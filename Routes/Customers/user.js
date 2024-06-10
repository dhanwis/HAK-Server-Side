const express = require("express");
const { login, logout } = require("../../helpers/customers");

const router = express.Router();

router.post(`/auth/login`, login);
router.post(`/auth/logout`, logout);

//order admin functionality
router.get("/customer/profile");
router.get("/customer/total_orders");
router.get("/customer/cart");
router.get("/customer/whishItems");

module.exports = router;
