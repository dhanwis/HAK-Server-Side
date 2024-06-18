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
    console.log("hai");
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

      // Validate product data before saving
      if (!Array.isArray(product_features)) {
        throw new Error("product_features must be an array");
      }
      // Look up the category by name to get its ObjectId, or create a new category if it doesn't exist
      let category = await Category.findOne({ name: product_category.trim() });
      if (!category) {
        category = new Category({ name: product_category.trim() });
        await category.save();
        console.log("missmatch");
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
        product_availability,
        product_tags,
        product_brand,
        product_stock_quantity,
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

  getAllProduct: async (req, res) => {
    console.log('hai');
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
};
