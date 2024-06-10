// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const superAdminRoute = require("./Routes/SuperAdmin/admin");
const productAdminRoute = require("./Routes/ProductAdmin/admin");
const salesAdminRoute = require("./Routes/SalesAdmin/admin");
const orderAdminRoute = require("./Routes/OrderAdmin/admin");
const customersRoute = require("./Routes/Customers/user");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//cors configuration
app.use(cors({ origin: "http://localhost:5173" }));

//other middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/superAdmin", superAdminRoute);
app.use("/productAdmin", productAdminRoute);
app.use("/salesAdmin", salesAdminRoute);
app.use("/orderAdmin", orderAdminRoute);
app.use("/customers", customersRoute);

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error(err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
