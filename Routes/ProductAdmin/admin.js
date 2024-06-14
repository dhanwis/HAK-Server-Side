const express = require("express");
const { login, logout, addProduct } = require("../../helpers/productAdmin");
const multer = require("multer");

const router = express.Router();

// Set up Multer storage for images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where image files will be stored
    console.log(file);
    cb(null, "uploads/ProductImages/");
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

// File filter function for images
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept image file
  } else {
    cb(new Error("Only images are allowed")); // Reject non-image file
  }
};

// File filter function for PDFs
const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    console.log(file);
    cb(null, true); // Accept PDF file
  } else {
    cb(new Error("Only PDF files are allowed")); // Reject non-PDF file
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
   
  imageUpload.array('photo',2),
  pdfUpload.single('docs'),
  (req, res) => {
    // Access form fields and uploaded files using req.body and req.files respectively
    const productData = req.body;
    // const productImages = req.files.product_images;
    // const warrantyCard = req.file.product_warranty_card;

    console.log(productData);
    // console.log(productImages);
    // console.log(warrantyCard);

    // Process the product data, images, and warranty card as needed
    // Example: Save product data, images, and warranty card to database

    res.send("Product added successfully");
  }
);

router.post("/product/view_all");
router.post("/product/edit");
router.post("/product/delete");

module.exports = router;
