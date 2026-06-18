require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("../db");
connectDB();

const app = express();

app.use(cors());
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

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SmartBizz server running"
  });
});

module.exports = app;