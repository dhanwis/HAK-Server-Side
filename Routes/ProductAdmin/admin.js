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
  filename: function (req, file, cb) {
    // Specify the filename for image files
    cb(null, file.originalname);
  },
});

// Set up Multer storage for PDFs
const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where PDF files will be stored
    console.log(file);
    cb(null, "uploads/ProductDocs/");
  },
  filename: function (req, file, cb) {
    // Specify the filename for PDF files
    cb(null, file.originalname);
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

// Initialize Multer upload instances for images and PDFs
const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});
const pdfUpload = multer({
  storage: pdfStorage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(`/auth/login`, login);
router.post(`/auth/logout`, logout);

//product admin functionality
// Route to handle product addition
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
