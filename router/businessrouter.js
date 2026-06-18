const express = require("express");
const router = express.Router();
const vendorAuth = require("../Controller/Middleware/vendorAuth");
const createUpload = require("../Controller/Middleware/productupload"); // ✅
const businessController = require("../Controller/businessController");

const upload = createUpload("business"); // ✅ saves to uploads/business/

// POST http://localhost:5000/api/business/create
router.post("/create", vendorAuth, upload.single("logo"), businessController.createBusiness);

// PUT http://localhost:5000/api/business/update
router.put("/update", vendorAuth, upload.single("logo"), businessController.updateBusiness);

// GET http://localhost:5000/api/business/My
router.get("/my", vendorAuth, businessController.getMyBusinesses);

module.exports = router;