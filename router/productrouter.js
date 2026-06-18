const express    = require("express")
const router     = express.Router()
const ProductController = require("../Controller/Vendor/ProductController")
const vendorAuth = require("../Controller/Middleware/vendorAuth")
const createUpload = require("../Controller/Middleware/productupload")

// ✅ Fix — createUpload("products") call karo
const upload = createUpload("products")

// POST http://localhost:5000/api/vendor/product/add-Product
router.post("/add-Product", vendorAuth, upload.single("image"), ProductController.addProduct)

// GET http://localhost:5000/api/vendor/Product/view-Product
router.get("/view-Product", vendorAuth, ProductController.viewProducts)

// PUT http://localhost:5000/api/Vendor/product/status/:id
router.put("/status/:id", vendorAuth, ProductController.toggleStatus)

// DELETE http://localhost:5000/api/Vendor/product/delete/:id
router.delete("/delete/:id", vendorAuth, ProductController.deleteProduct)

// PUT http://localhost:5000/api/Vendor/product/update/:id
router.put("/update/:id",  vendorAuth, ProductController.updateProduct) 

module.exports = router