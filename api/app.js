// require("dotenv").config()
// const express  = require("express")
// const mongoose = require("mongoose")
// const cors     = require("cors")
// const path     = require("path")
// const serverless = require('serverless-http');

// const connectDB = require("../db")
// connectDB()

// const app = express()
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(
//   cors({
//     origin: "http://localhost:5173"
//   })
// );

// // ✅ Routes — exact filenames must match your folder
// const userRoutes             = require("../router/userrouter")
// const adminRoutes            = require("../router/adminrouter")
// const vendorRoutes           = require("../router/vendorrouter")
// const subscriptionPlanRoutes = require("../router/subscriptionPlanRouter")
// const businessRoutes         = require("../router/businessrouter")
// const categoryRoutes         = require("../router/Categoryrouter")
// const productRoutes          = require("../router/productrouter")
// const billRoutes             = require("../router/billrouter")
// const paymentRoutes          = require("../router/paymentrouter")

// // ✅ Mount routes
// app.use("/api/vendor/product", productRoutes)
// app.use("/api/vendor",         vendorRoutes)
// app.use("/api/admin",          adminRoutes)          // → POST /api/admin/login ✅
// app.use("/api/plans",          subscriptionPlanRoutes)
// app.use("/api/business",       businessRoutes)
// app.use("/api/category",       categoryRoutes)
// app.use("/api/bill",           billRoutes)
// app.use("/api/user",           userRoutes)
// app.use("/api/payment",        paymentRoutes)

// // ✅ Static uploads
// app.use("/uploads",          express.static(path.join(__dirname, "uploads")))
// app.use("/uploads/products", express.static(path.join(__dirname, "uploads", "products")))

// // // ✅ Test route — open http://localhost:5000/api/health to confirm server works
// // app.get("/api/health", (req, res) => {
// //   res.json({ success: true, message: "SmartBizz server is running ✅" })
// // })

// // const PORT = process.env.PORT || 5000
// // app.listen(PORT, () => {
// //   console.log(`🚀 SmartBIZZ running on port ${PORT}`)
// // })

// module.exports = app;
// module.exports.handler = serverless(app);



require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const serverless = require("serverless-http");
const connectDB = require("../db");
connectDB();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require("../router/userrouter");
const adminRoutes = require("../router/adminrouter");
const vendorRoutes = require("../router/vendorrouter");
const subscriptionPlanRoutes = require("../router/subscriptionPlanRouter");
const businessRoutes = require("../router/businessrouter");
const categoryRoutes = require("../router/Categoryrouter");
const productRoutes = require("../router/productrouter");
const billRoutes = require("../router/billrouter");
const paymentRoutes = require("../router/paymentrouter");

app.use("/api/vendor/product", productRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/plans", subscriptionPlanRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/bill", billRoutes);
app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SmartBizz server running"
  });
});

module.exports = app;