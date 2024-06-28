const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    unique: true, // If product_id should be unique
  },
  product_name: { type: String, required: true, trim: true },
  product_description: { type: String, required: true, trim: true },

  product_category: { type: String, required: true },
  product_weight: { type: Number, required: false },

  product_features: { type: String, required: true },
  // product_publish_date: { type: Date, required: true },
  // product_publish_time: { type: String, required: true },
  product_publish_datetime: { type: Date, required: true },
  product_publish_status: { type: String, required: true },

  product_tags: { type: [String], required: true },
  product_type: { type: String, requred: true },
  product_gender: { type: String, requred: true },
  product_brand: { type: String, required: true, trim: true },

  similar_products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  variations: [
    {
      color: { type: String, required: true },
      images: {
        type: [String],
        required: true,
        validate: {
          validator: (images) => images.length > 1,
          message: "At least 2 product images are required.",
        },
      },
      skus: [
        {
          size: { type: String, required: true },

          discount: { type: Number, default: 0 },
          in_stock: { type: Boolean, required: true },
          quantity: { type: Number, required: true },
          actualPrice: { type: Number, required: true },
        },
      ],
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
