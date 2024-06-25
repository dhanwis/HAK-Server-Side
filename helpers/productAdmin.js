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
    const {
      product_id,
      product_name,
      product_description,

      product_category,
      product_weight,

      product_gender,
      product_type,
      product_features,
      product_publish_date,
      product_publish_time,
      product_publish_status,

      product_tags,
      product_brand,
      variations,
    } = req.body;

    // Handle product images
    let productImg = [];
    if (req.files && req.files.length > 2) {
      productImg = req.files.map((file) => file.filename);
    } else {
      throw new Error("Product Image should be multiple.");
    }

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

    // Create an array to store variations with SKUs
    const variationsWithSKUs = [];

    // Iterate through variations and format them
    variations.forEach((variation) => {
      const { color, skus } = variation;

      // Format skus array (assuming skus is an array of objects with size, price, etc.)
      const formattedSkus = skus.map((sku) => ({
        size: sku.size,
        actualPrice: sku.actualPrice,
        quantity: sku.quantity,
        discount: sku.discount,
        in_stock: sku.quantity >= 1 ? true : false,
      }));

      // Push formatted variation with skus into variationsWithSKUs array
      variationsWithSKUs.push({
        color,
        images: productImg,
        skus: formattedSkus,
      });
    });

    const newProduct = new Product({
      product_id: product_id,
      product_name,
      product_description,

      product_category: categoryId,
      product_weight,

      product_type,
      product_gender,

      product_features: product_features.join(", "),
      product_publish_date,
      product_publish_time,
      product_publish_status,

      product_tags,
      product_brand,
      variants: variationsWithSKUs,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Find similar products based on multiple criteria
    const similarProducts = await Product.find({
      product_category: savedProduct.product_category,
      product_tags: { $in: savedProduct.product_tags },
      product_brand: savedProduct.product_brand,
      product_description: savedProduct.product_description,
      _id: { $ne: savedProduct._id }, // Exclude the newly added product
    }).limit(20); // Adjust the limit as necessary

    // Update the new product with similar products
    savedProduct.similar_products = similarProducts.map(
      (product) => product._id
    );

    console.log("savedProduct", savedProduct);

    await savedProduct.save();

    res.status(200).json({
      product: savedProduct,
      similarProducts,
    });
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
    console.log("abc");
    const productId = req.params.id;

    console.log("productId", productId);

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
      res.status(200).json(products);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getProductById: async (req, res) => {
    console.log(req.params);
    try {
      const product = await Product.findById(req.params.id).populate(
        "product_category similar_products parent_product"
      );
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
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

// try {
//   const {
//     product_id,
//     product_name,
//     product_description,
//     // product_cost,
//     // product_discount,
//     product_category,
//     product_weight,
//     // product_size,
//     // product_color,
//     product_gender,
//     product_type,
//     product_features,
//     // product_publish_date,
//     // product_publish_time,
//     // product_publish_status,
//     //product_availability,
//     product_tags,
//     product_brand,
//     // product_stock_quantity,
//     parent_product,
//   } = req.body;

//   console.log("Received product ID:", product_id); // Log the received product ID

//   // Validate product_id
//   if (!product_id) {
//     throw new Error("product_id is required");
//   }

//   // Handle product images
//   let productImg = [];
//   if (req.files && req.files.length > 2) {
//     productImg = req.files.map((file) => file.filename);
//   } else {
//     throw new Error("Product Image should be multiple.");
//   }

//   // Validate product data before saving
//   if (!Array.isArray(product_features)) {
//     throw new Error("product_features must be an array");
//   }

//   // Look up the category by name to get its ObjectId, or create a new category if it doesn't exist
//   let category = await Category.findOne({ name: product_category.trim() });

//   if (!category) {
//     category = new Category({ name: product_category.trim() });
//     await category.save();
//   }
//   const categoryId = category._id;

//   // Create the new product
//   const newProduct = new Product({
//     product_id: product_id,
//     product_name,
//     product_description,
//     product_cost,
//     product_discount,
//     product_category: categoryId,
//     product_weight,
//     product_size,
//     product_color,
//     product_type,
//     product_gender,
//     product_images: productImg,
//     product_features: product_features.join(", "),
//     product_publish_date,
//     product_publish_time,
//     product_publish_status,
//     product_availability,
//     product_tags,
//     product_brand,
//     product_stock_quantity,
//     parent_product,
//   });

//   // Save the product to the database
//   const savedProduct = await newProduct.save();

//   // Find similar products based on multiple criteria
//   const similarProducts = await Product.find({
//     product_category: savedProduct.product_category,
//     product_tags: { $in: savedProduct.product_tags },
//     product_brand: savedProduct.product_brand,
//     product_description: savedProduct.product_description,
//     _id: { $ne: savedProduct._id }, // Exclude the newly added product
//   }).limit(20); // Adjust the limit as necessary

//   console.log("Similar products found:", similarProducts);

//   // Update the new product with similar products
//   savedProduct.similar_products = similarProducts.map(
//     (product) => product._id
//   );

//   similarProducts.map((a) => console.log("a", a));
//   await savedProduct.save();

//   res.status(201).json({
//     product: savedProduct,
//     similarProducts,
//   });
// } catch (error) {
//   console.error(error); // Log the error
//   res.status(400).json({ error: error.message });
// }
