const { default: mongoose } = require("mongoose");

const VariantSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    availability: { type: Boolean, required: true },
    stock_quantity: { type: Number, required: true }
  });
  
  module.exports = mongoose.model('Variant', VariantSchema);
  