const express = require("express");
const router = express.Router();
const categoryController = require("../Controller/Vendor/CategoryController");
const vendorAuth = require("../Controller/Middleware/vendorAuth");

// POST http://localhost:5000/api/category/add-category
router.post("/add-category", vendorAuth, categoryController.addCategory);

// GET http://localhost:5000/api/category/view-category
router.get("/view-category", vendorAuth, categoryController.viewCategory);

// PUT http://localhost:5000/api/category/status/:id
router.put("/status/:id", vendorAuth, categoryController.toggleStatus);

// DELETE http://localhost:5000/api/category/delete-category/:id
router.delete("/delete-category/:id", vendorAuth, categoryController.deleteCategory);

module.exports = router;