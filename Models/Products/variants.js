const { default: mongoose } = require("mongoose");

const VariantSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
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
      //sku: { type: String, required: true },
      discount: { type: Number, default: 0 },
      in_stock: { type: Boolean, required: true },
      quantity: { type: Number, required: true },
      actualPrice: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Variant", VariantSchema);
