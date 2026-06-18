const express    = require("express")
const router     = express.Router()
const vendorAuth = require("../Controller/Middleware/vendorAuth")
const billCtrl   = require("../Controller/Vendor/billController")

// POST http://localhost:5000/api/bill/create
router.post("/create", vendorAuth, billCtrl.createBill)

// GET http://localhost:5000/api/bill/all
router.get("/all", vendorAuth, billCtrl.getBills)

// GET http://localhost:5000/api/bill/:id
router.get("/:id", vendorAuth, billCtrl.getBillById)

// DELETE http://localhost:5000/api/bill/delete/:id
router.delete("/delete/:id", vendorAuth, billCtrl.deleteBill)

module.exports = router