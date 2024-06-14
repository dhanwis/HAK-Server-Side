const express = require("express");
const { login, logout, addProduct } = require("../../helpers/productAdmin");
const multer = require("multer");

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Change path as needed
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }); // Use default single file handling
const uploadMultiple = upload.array('photo'); // Allow multiple images with field name 'photo'

// Route for adding product
router.post('/product/add', uploadMultiple, (req, res) => {
  try {
    // Access form data (excluding files)
    const productData = req.body; // { uname, email, price }
    console.log(productData)
    console.log(req.files)

    // Access uploaded images (array of files)
    // const uploadedImages = req.files['photo'];

    // // Perform validation (optional)
    // if (uploadedImages.length === 0) {
    //   throw new Error('Please select at least one image file.');
    // }

    // Process product data and images (e.g., save files to disk, create database entries)
    // ... your logic here ...

    res.json({ message: 'Product added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Failed to add product' }); // Send appropriate error message
  }
});


router.post("/product/view_all");
router.post("/product/edit");
router.post("/product/delete");

module.exports = router;
