const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true, trim: true }, // Product name, trimmed
  product_description: { type: String, required: true, trim: true }, // Detailed product description
  product_cost: { type: Number, required: true }, // Price (consider using a decimal type for precision)
  product_discount: { type: Number, default: 0 }, // Discount percentage
  product_category: { type: Types.ObjectId, ref: 'Category', required: true }, // Reference to category
  product_weight: { type: Number, required: false }, // Weight (optional)
  product_images: {
    type: [String], // Array of image URLs
    required: true,
    validate: {
      validator: (images) => images.length >= 1,
      message: 'At least one product image is required.'
    }
  },
  warranty_doc: {
    type: String, // Path or URL to the warranty document (optional)
    validate: {
      validator: (path) => {
        // Optional validation for allowed file extensions (if applicable)
        const allowedExtensions = ['.pdf', '.docx', '.xlsx']; // Add more extensions as needed
        return !path || allowedExtensions.includes(path.split('.').pop().toLowerCase());
      },
      message: 'Invalid warranty document format.'
    }
  },

  brand: { type: String, required: true, trim: true }, // Product brand
  in_stock: { type: Boolean, default: true }, // Availability (in stock or out of stock)
  stock_quantity: { type: Number, default: 0 }, // Current stock quantity (optional)
  
  ratings: {
    type: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who rated
      rating: { type: Number, required: true, min: 1, max: 5 }, // Rating score (1-5)
      review: { type: String, trim: true }, // Optional review text
    }],
    default: []
  },
  createdAt: { type: Date, default: Date.now }
});


//optional
//seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the seller user

module.exports = mongoose.model('Product', productSchema);
