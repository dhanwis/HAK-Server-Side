const express = require("express");
const { login, logout } = require("../../helpers/superAdmin");
const router = express.Router();

const multer = require("multer");

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/ProductAdmins");
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

// Create the multer instance

router.post(`/auth/login`, login);
router.post(`/auth/logout`, logout);

//super admin functionality
router.get("/admin/products ");
router.get("/admin/orders ");
router.get("/admin/all_customers ");

//manage other admins;
router.post("/add/temp_admins");
router.post("/add/product_admins", upload.single("productAdminImg"));
router.post("/add/order_admins");
router.post("/add/sales_admins");

//manage product admins

router.get("/view/all_productAdmins");
router.get("/view/productAdmin/:id");
router.put("/update/productAdmin/:id");
router.delete("/delete/productAdmin/:id");

module.exports = router;
