const express = require("express");
const { login } = require("../../helpers/superAdmin");
const router = express.Router();

router.post(`/auth/login`, login);
router.get("/data", (req, res) => {});

module.exports = router;
