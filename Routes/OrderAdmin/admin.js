const express = require("express");
const { login, logout } = require("../../helpers/orderAdmin");

const router = express.Router();

router.post(`/auth/login`, login);
router.post(`/auth/logout`, logout);

//order admin functionality

module.exports = router;
