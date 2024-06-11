const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, unique: true }, // Optional for registration
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  pincode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
});

// customerSchema.pre("save", async function (next) {
//   // Hash password before saving (if applicable)
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10); // Replace with preferred hashing library
//   }
//   next();
// });

module.exports = mongoose.model("Customer", customerSchema);
