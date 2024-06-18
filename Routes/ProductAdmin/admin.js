const express = require("express");
const { login, logout, addProduct, getAllProduct } = require("../../helpers/productAdmin");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} = require("../../helpers/categories");

const router = express.Router();

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // This function will be called for each file individually
    // Use the product name sent as part of the request body to dynamically create folders
    const productName = req.body.product_name;
    const uploadPath = `public/ProductImg/${productName}`;

    // Create the directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    // Set the destination for storing files
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique identifier for the filename using uuidv4()
    const uniqueFilename = uuidv4(); // This will generate a unique identifier

    // Get the original filename to maintain some context
    const originalname = file.originalname;

    // Combine the unique identifier with the original filename (or customize as needed)
    cb(null, uniqueFilename + "-" + originalname);
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
  limits: { fileSize: 3000000 }, //means maximum file size 3mb;
  fileFilter: fileFilter,
});

router.post(`/auth/login`, login);
router.post(`/auth/logout`, logout);

//product admin functionality
router.post("/product/add", upload.array("product_images", 6), addProduct);

router.post("/product/view_all_products", getAllProduct);
router.post("/product/edit");
router.post("/product/delete");

// Category routes
router.post("category/add-category", addCategory);
router.get("category/categories", getCategories);
router.put("category/update-category/:id", updateCategory);
router.delete("category/delete-category/:id", deleteCategory);

module.exports = router;
