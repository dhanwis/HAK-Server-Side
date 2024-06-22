const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    unique: true, // If product_id should be unique
  },
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
  //product_size: { type: String, required: true },
  //product_color: { type: [String], required: true },
  product_images: {
    type: [String],
    required: true,
    validate: {
      validator: (images) => images.length > 1,
      message: "At least 2 product images are required.",
    },
  },

  product_features: { type: String, required: true },
  product_publish_date: { type: Date, required: true },
  product_publish_time: { type: String, required: true },
  product_publish_status: { type: String, required: true },
  product_availability: { type: String, required: true },
  product_tags: { type: [String], required: true },
  product_type: { type: String, requred: true },
  product_gender: { type: String, requred: true },
  product_brand: { type: String, required: true, trim: true },
  product_stock_quantity: { type: Number, required: true },
  parent_product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default: null,
  },
  similar_products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  variants: [
    {
      product_color: { type: String, required: true },
      product_size: { type: String, required: true },
      skus: [
        {
          product_size: { type: String, required: true },
          sku: { type: String, required: true },
          product_in_stock: { type: Boolean, required: true },
        },
      ],
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
