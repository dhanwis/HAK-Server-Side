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
    try {
      const {
        product_id,
        product_name,
        product_description,
        product_cost,
        product_discount,
        product_category,
        product_weight,
        product_size,
        product_color,
        product_gender,
        product_type,
        product_features,
        product_publish_date,
        product_publish_time,
        product_publish_status,
        product_availability,
        product_tags,
        product_brand,
        product_stock_quantity,
        parent_product,
      } = req.body;

      const productImg = req.files.map((file) => {
        return file.filename;
      });

      // Validate product data before saving
      if (!Array.isArray(product_features)) {
        throw new Error("product_features must be an array");
      }
      // Look up the category by name to get its ObjectId, or create a new category if it doesn't exist
      let category = await Category.findOne({ name: product_category.trim() });
      console.log('c',category)
      if (!category) {
        category = new Category({ name: product_category.trim() });
        console.log('new')
        await category.save();
      }
      const categoryId = category._id;

      // Create the new product
      const newProduct = new Product({
        product_id,
        product_name,
        product_description,
        product_cost,
        product_discount,
        product_category: categoryId,
        product_weight,
        product_size,
        product_color,
        product_type,
        product_gender,
        product_images: productImg,
        product_features: product_features.join(", "),
        product_publish_date,
        product_publish_time,
        product_publish_status,
        product_availability,
        product_tags,
        product_brand,
        product_stock_quantity,
        parent_product,
      });

      console.log('newproduct',newProduct)

      // Save the product to the database
      const savedProduct = await newProduct.save();
      console.log('savedProduct.product_category',savedProduct.product_category)

      // Find similar products based on multiple criteria
    const similarProducts = await Product.find({
      product_category: savedProduct.product_category,
      product_tags: { $in: savedProduct.product_tags },
      product_brand: savedProduct.product_brand,
      product_cost: { $gte: savedProduct.product_cost * 0.8, $lte: savedProduct.product_cost * 1.2 }, // within 20% price range
      _id: { $ne: savedProduct._id } // Exclude the newly added product
    }).limit(10); // Adjust the limit as necessary

    console.log('similar',similarProducts)

    // Remove duplicate IDs if any
    const uniqueSimilarProducts = [...new Set(similarProducts.map(product => product._id.toString()))];

    // Update the new product with unique similar products
    savedProduct.similar_products = uniqueSimilarProducts.map(id => mongoose.Types.ObjectId(id));
    await savedProduct.save();

      console.log('saved success',savedProduct)
      res.status(201).json(savedProduct);
    } catch (error) {
      if (
        error.code === 11000 &&
        error.keyPattern &&
        error.keyPattern.productId === 1
      ) {
        // Handle duplicate key error for productId
        console.log("Duplicate productId found");
        res.status(400).json({ error: "Duplicate productId found." });
      } else {
        // Handle other errors
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error." });
      }
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

  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate(
        "product_category similar_products parent_product"
      );
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product", error });
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
