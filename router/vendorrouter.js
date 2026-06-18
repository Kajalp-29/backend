const express = require("express");
const router  = express.Router();

const vendorController = require("../Controller/Vendor/VendorController");
const vendorAuth       = require("../Controller/Middleware/vendorAuth");
const UserController   = require("../Controller/UserController");
const vendorProfileController = require("../Controller/Vendor/VendorController");

// POST http://localhost:5000/api/vendor/register
router.post("/register", vendorController.registerVendor);

// POST http://localhost:5000/api/vendor/login
router.post("/login", vendorController.loginVendor);


// GET  http://localhost:5000/api/vendor/profile
router.get("/profile", vendorAuth, vendorProfileController.getVendorProfile);

// POST http://localhost:5000/api/vendor/update-profile
router.post("/update-profile", vendorAuth, vendorProfileController.updateVendorProfile);

// POST http://localhost:5000/api/vendor/change-password
router.post("/change-password", vendorAuth, vendorProfileController.changeVendorPassword);

// ✅ POST http://localhost:5000/api/vendor/forgot-password
router.post("/forgot-password", vendorController.forgotPassword);

// ✅ POST http://localhost:5000/api/vendor/reset-password/:token
router.post("/reset-password/:token", vendorController.resetPassword);

// POST http://localhost:5000/api/vendor/add-user
router.post("/add-user", vendorAuth, UserController.addUser);

// GET http://localhost:5000/api/vendor/view-user
router.get("/view-user", vendorAuth, UserController.viewUsers);

module.exports = router;