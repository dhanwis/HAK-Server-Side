const express = require("express");
const {
  login,
  logout,
  addProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByCategory,
} = require("../../helpers/productAdmin");
const multer = require("multer");
const path = require("node:path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} = require("../../helpers/categories");

const router = express.Router();
 

// Define storage for the images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    const productId = req.body.product_id
 
    const mainProductPath = path.join(
      __dirname,
      "uploads",
      "products",
      productId
    );

    if (!fs.existsSync(mainProductPath)) {
      fs.mkdirSync(mainProductPath, { recursive: true });
    }

    if (file.fieldname.startsWith("product_images")) {
      cb(null, path.join(__dirname, "uploads", "products",productId));
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
  },
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});
 
router.post(`/auth/login`, login);
router.post(`/auth/logout`, logout);

//product admin functionality
router.post("/product/add", upload.array("product_images", 6), addProduct);

router.post("/product/edit", updateProduct);
router.post("/product/delete", deleteProduct);
router.get("/product/view_all_products", getAllProduct);
router.get("/product/viewProductBy/:id", getProductById);
router.get("/product/category/:category", getProductByCategory);

// Category routes
router.post("category/add-category", addCategory);
router.get("category/categories", getCategories);

router.put("category/update-category/:id", updateCategory);
router.delete("category/delete-category/:id", deleteCategory);

module.exports = router;
