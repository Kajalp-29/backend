const express = require("express");
const router = express.Router();

const orderController = require("../Controller/order/orderController");

// http://localhost:5000/orderapi/orders
router.get("/order", orderController.getorders);

module.exports = router;