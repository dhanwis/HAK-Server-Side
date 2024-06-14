const express = require("express");
const { login, logout, addProduct } = require("../../helpers/productAdmin");
const multer = require("multer");

const router = express.Router();

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file)
    cb(null, "public/ProductImg");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter for handling images and warranty documents
const fileFilter = (req, file, cb) => {
  // Allowed extensions for images and warranty documents
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};

// Initialize multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 }, //means maximum file size 2mb;
  fileFilter: fileFilter,
});

router.post(`/auth/login`, login);
router.post(`/auth/logout`, logout);

//product admin functionality
router.post(
  "/product/add",
  upload.array('product_images',6),
  (req, res) => {
    console.log(req.body);
    console.log(req.files);
  }
);

router.post("/product/view_all");
router.post("/product/edit");
router.post("/product/delete");

module.exports = router;
