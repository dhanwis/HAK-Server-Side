const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true, trim: true },
  product_description: { type: String, required: true, trim: true },
  product_cost: { type: Number, required: true },
  product_discount: { type: Number, default: 0 },
  product_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  product_weight: { type: Number, required: false },
  product_size: { type: String, required: true },
  product_color: { type: [String], required: true }, // Array of colors to handle multiple color options
  product_images: {
    type: [String],
    required: true,
    validate: {
      validator: (images) => images.length > 2,
      message: "At least 3 product images are required.",
    },
  },
  similar_products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Array of product IDs for similar products
  product_features: { type: String, required: true },
  product_publish_date: { type: Date, required: true },
  product_publish_time: { type: String, required: true },
  product_publish_status: { type: String, required: true },
  product_availability: { type: String, required: true },
  product_tags: { type: [String], required: true }, // Array of tags for better search and categorization
  product_brand: { type: String, required: true, trim: true },
  product_stock_quantity: { type: Number, required: true },
  parent_product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null } // Field to link variations of the same product
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
