const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true, trim: true }, // Product name, trimmed
  product_description: { type: String, required: true, trim: true }, // Detailed product description
  product_cost: { type: Number, required: true }, // Price (consider using a decimal type for precision)
  product_discount: { type: Number, default: 0 }, // Discount percentage
  product_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  }, // Reference to category
  product_weight: { type: Number, required: false }, // Weight (optional)
  product_size: { type: String, required: true },
  product_color: { type: Array, require: true },
  product_description: { type: String, required: true },
  product_images: {
    type: [String], // Array of image URLs
    required: true,
    validate: {
      validator: (images) => images.length > 1,
      message: "At least 2 product images is required.",
    },
  },
  similar_products: { type: [mongoose.Schema.Types.ObjectId], ref: 'Product' },
  product_features: { type: String, required: true },
  product_publish_date: {
    type: Date,
    required: true 
  },
  product_publish_time: {
    type: String,  
    required: true  
  },
  product_publish_status: { type: String, required: true },
 product_availability: { type: String, required: true }, // Availability (in stock or out of stock)

 product_tags: { type: Array, require: true },

  product_brand: { type: String, required: true, trim: true }, // Product brand

  product_stock_quantity: { type: Number, required: true }, // Current stock quantity (optional)

  // product_ratings: {
  //   type: [
  //     {
  //       user: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, // User who rated
  //       rating: { type: Number, required: true, min: 1, max: 5 }, // Rating score (1-5)
  //       review: { type: String, trim: true }, // Optional review text
  //     },
  //   ],
  //   default: [],
  // },
  //createdAt: { type: Date, default: Date.now },
});

//optional
//seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the seller user
// warranty_doc: {
//   type: String, // Path or URL to the warranty document (optional)
//   validate: {
//     validator: (path) => {
//       // Optional validation for allowed file extensions (if applicable)
//       const allowedExtensions = [".pdf", ".docx", ".xlsx"]; // Add more extensions as needed
//       return (
//         !path ||
//         allowedExtensions.includes(path.split(".").pop().toLowerCase())
//       );
//     },
//     message: "Invalid warranty document format.",
//   },
// },

module.exports = mongoose.model("Product", productSchema);
