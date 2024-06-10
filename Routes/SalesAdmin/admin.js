const express = require("express");
const { login, logout } = require("../../helpers/salesAdmin");

const router = express.Router();

router.post(`/auth/login`, login);
router.post(`/auth/logout`, logout);

//sales admin functionality
router.get("/sales/orders");
router.get("/sales/reports");

module.exports = router;
