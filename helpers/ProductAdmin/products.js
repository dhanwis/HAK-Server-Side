const Product = require("../../Models/Products/Product");
const Category = require("../../Models/Products/category");
const fs = require("fs");
const path = require("path");

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

      product_publish_datetime,
      product_publish_status,

      product_tags,
      product_brand,
      variations,
    } = req.body;

    console.log("add", req.body);

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

      product_category,
      product_weight,

      product_type,
      product_gender,

      product_features: product_features.join(", "),
      // product_publish_date,
      // product_publish_time,
      product_publish_datetime: new Date(product_publish_datetime),
      product_publish_status,

      product_tags,
      product_brand,
      variations: variationsWithSKUs,
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

    await savedProduct.save();

    res.status(200).json({
      product: savedProduct,
      similarProducts,
    });
  },

  updateProduct: async (req, res) => {
    const productId = req.params.id;
    const updates = req.body;
    const updateImg = req.files;

    try {
      const productToUpdate = await Product.findById(productId);

      if (!productToUpdate) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (!updates || typeof updates !== "object") {
        throw new Error("Invalid product updates");
      }

      if (
        updates.product_features &&
        !Array.isArray(updates.product_features)
      ) {
        throw new Error("product_features must be an array");
      }

      if (Array.isArray(updates.product_features)) {
        updates.product_features = updates.product_features.join(", ");
      }

      productToUpdate.product_name = updates.product_name;
      productToUpdate.product_weight = updates.product_weight;
      productToUpdate.product_type = updates.product_type;
      productToUpdate.product_brand = updates.product_brand;
      productToUpdate.product_category = updates.product_category;
      productToUpdate.product_description = updates.product_description;
      productToUpdate.product_features = updates.product_features;
      productToUpdate.product_gender = updates.product_gender;
      productToUpdate.product_tags = updates.product_tags;

      let productImg = [];
      if (updateImg && Array.isArray(updateImg)) {
        productImg = updateImg.map((file) => file.filename);
      }

      if (updates.existingImages) {
        if (!Array.isArray(updates.existingImages)) {
          updates.existingImages = [updates.existingImages];
        }
        productImg = [...updates.existingImages, ...productImg];
      }

      const variationsWithSKUs = [];

      if (Array.isArray(updates.variations)) {
        updates.variations.forEach((variation, index) => {
          const { color, skus } = variation;

          if (Array.isArray(skus)) {
            const formattedSkus = skus.map((sku) => ({
              size: sku.size,
              actualPrice: sku.actualPrice,
              quantity: sku.quantity,
              discount: sku.discount,
              in_stock: sku.quantity >= 1,
            }));

            variationsWithSKUs.push({
              color,
              images: index === 0 ? productImg : [], // Assign productImg only to the first variation
              skus: formattedSkus,
            });
          } else {
            throw new Error("Invalid skus format");
          }
        });
      } else {
        console.log("updates.variations:", updates.variations); // Log variations to inspect
        throw new Error("variations must be an array");
      }

      const oldImages = productToUpdate.variations[0].images;
      const imagesToDelete = oldImages.filter(
        (image) => !productImg.includes(image)
      );

      imagesToDelete.forEach((image) => {
        console.log("imgs", image);
        const imagePath = path.join(
          __dirname,
          `../public/ProductImg/${productToUpdate.product_id}`,
          image
        );
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Failed to delete image: ${imagePath}`, err);
          }
        });
      });

      productToUpdate.variations = variationsWithSKUs;

      await productToUpdate.save();

      res.status(200).json(productToUpdate);
    } catch (error) {
      console.error("Error updating product:", error); // Log the error for debugging
      res.status(500).json({ error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    const productId = req.params.id;

    try {
      const productToDelete = await Product.findById(productId);

      if (!productToDelete) {
        return res.status(404).json({ message: "Product not found" });
      }

      await Product.findByIdAndDelete(productId);

      // Construct the image path and delete the folder if it exists
      if (productToDelete.product_id) {
        const imagePath = path.join(
          __dirname,
          "../public/ProductImg",
          productToDelete.product_id
        );

        // Check if the folder exists before attempting to delete
        if (fs.existsSync(imagePath)) {
          await fs.promises.rm(imagePath, { recursive: true });
          console.log("Deleted folder:", imagePath);
        } else {
          console.log("Folder does not exist:", imagePath);
        }
      } else {
        console.log("product_id was missing");
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllProduct: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate(
        "similar_products"
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
