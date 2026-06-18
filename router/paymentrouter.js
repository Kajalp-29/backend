const express = require("express");
const router = express.Router();
const {
    createOrder,verifyPayment
} = require("../Controller/payment/paymentController");
const vendorAuth = require("../Controller/Middleware/vendorAuth");
const paymentController = require("../Controller/payment/paymentController");



// https://localhost:5000/api/create-order
router.post("/create-order", createOrder);

//https://localhost:5000/api/verify-payment
router.post("/verify-payment",vendorAuth, paymentController.verifyPayment);

module.exports = router;