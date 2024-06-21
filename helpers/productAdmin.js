const Product = require("../Models/Products/Product");
const Category = require("../Models/Products/category");

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
    console.log(req.body);
    try {
      // Access the uploaded files
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
        // product_availability,
        //product_tags,
        similar_products,
        product_brand,
        product_stock_quantity,
      } = req.body;

      // Get the paths of the uploaded images
      //const product_images = req.files.map((file) => file.filename);
      const productImages = req.files["product_images"] || [];
      const similarProductImages = req.files["similar_product_images"] || [];

      //const productData = JSON.parse(req.body.productData);

      // Save product data and image paths to your database
      const product_images = productImages.map((file) => file.path);

      similar_products.forEach((similarProduct, index) => {
        similarProduct.product_images = similarProductImages
          .slice(
            (index * similarProductImages.length) / similar_products.length,
            ((index + 1) * similarProductImages.length) /
              similar_products.length
          )
          .map((file) => file.path);
      });

      // Validate product data before saving
      if (!Array.isArray(product_features)) {
        throw new Error("product_features must be an array");
      }
      // Look up the category by name to get its ObjectId, or create a new category if it doesn't exist
      let category = await Category.findOne({ name: product_category.trim() });
      if (!category) {
        category = new Category({ name: product_category.trim() });
        await category.save();
      }
      const categoryId = category._id;

      // Create a new product instance with the retrieved or created category ObjectId
      const newProduct = new Product({
        product_name,
        product_description,
        product_cost,
        product_discount,
        product_category: categoryId,
        product_weight,
        product_size,
        product_color,
        product_images,
        product_features: product_features.join(", "),
        product_publish_status,
        //product_availability,
        //product_tags,
        product_brand,
        product_stock_quantity,
        similar_products,
      });

      // Save the new product to the database
      await newProduct.save();

      console.log("product added successfully", newProduct);

      // Respond with a success message and the new product details
      res
        .status(200)
        .send({ message: "product added successfully", products: newProduct });
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).send(error.message);
    }
  },

  updateProduct: async (req, res) => {
    const productId = req.params.id;
    const updates = req.body;

    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updates,
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    const productId = req.params.id;

    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllProduct: async (req, res) => {
    console.log("hai");
    try {
      const products = await Product.find();
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getProductById: async () => {
    const productId = req.params.id;

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProductByCategory: async (req, res) => {
    try {
      const { categoryName } = req.params;

      // Find the category by name
      const category = await Category.findOne({ name: categoryName.trim() });
      if (!category) {
        return res.status(404).send("Category not found");
      }

      // Find products by category ObjectId
      const products = await Product.find({
        product_category: category._id,
      }).populate("product_category");
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
