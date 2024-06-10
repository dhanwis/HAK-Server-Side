const express = require("express");
const { login, logout } = require("../../helpers/productAdmin");
const multer = require("multer");

const router = express.Router();

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Products");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilterConfig = function (req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb("Error: Images only!");
  }
};

// Initialize multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 }, //means maximum file size 2mb;
  fileFilter: fileFilterConfig,
});

router.post(`/auth/login`, login);
router.post(`/auth/logout`, logout);

//product admin functionality
router.post("/product/add", upload.array("productImg", 6));
router.post("/product/view_all");
router.post("/product/edit");
router.post("/product/delete");

module.exports = router;
