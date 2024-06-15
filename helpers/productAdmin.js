const Product = require("../Models/Products/Product");
const Category = require("../Models/Products/category");
const mongoose = require("mongoose");

module.exports = {
  //authentication
  login: (req, res) => {
    try {
      const data = req.body; // Access data sent in the request body

      // Validate and process data
      console.log(data); // Example: Log received data
      res.send({ message: "Data received successfully!" }); // Send a response
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  },

  logout: () => {},

  //product_functions;

  addProduct: async (req, res) => {
    console.log("hai", req.body);

    try {
      const {
        product_name,
        product_description,
        product_cost,
        product_discount,
        product_category,
        product_weight,
        product_size,
        product_color,
        product_features,
        product_publish_status,
        product_availability,
        product_tags,
        product_brand,
        product_stock_quantity,
      } = req.body;

      // Get the paths of the uploaded images
      const product_images = req.files.map((file) => file.filename);

      const newProduct = await new Product({
        product_name,
        product_description,
        product_cost,
        product_discount,
        product_category: categoryId,
        product_weight,
        product_size,
        product_color,
        product_images,
        product_features,
        product_publish_status,
        product_availability,
        product_tags,
        product_brand,
        product_stock_quantity,
      });

      await newProduct.save();

      console.log("product added successfully", newProduct);

      res
        .status(200)
        .send({ message: "product added successfully", products: newProduct });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
