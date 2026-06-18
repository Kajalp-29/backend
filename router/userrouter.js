const express = require("express");
const router = express.Router();

const UserController = require("../Controller/UserController");
const vendorAuth = require("../Controller/Middleware/vendorAuth");

// POST http://localhost:5000/api/vendor/add-user
router.post("/add-user", vendorAuth, UserController.addUser);

// GET http://localhost:5000/api/vendor/view-user
router.get("/view-user", vendorAuth, UserController.viewUsers);

module.exports = router;
