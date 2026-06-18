const express   = require("express")
const router    = express.Router()
const adminAuth = require("../Controller/Middleware/adminAuth")

// ✅ Only ONE import — remove the duplicate adminController require
const {
  createAdmin,
  adminLogin,
  getAllVendors,
  updateAdmin,
  deleteVendor,
  getVendorById,
  getAdminProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} = require("../Controller/Admin/AdminController")

// ── PUBLIC ROUTES (no auth) ───────────────────────────────────────────────────
router.post("/create",                createAdmin)
router.post("/login",                 adminLogin)
router.post("/forgot-password",       forgotPassword)
router.post("/reset-password/:token", resetPassword)

// ── PROTECTED ROUTES (adminAuth required) ────────────────────────────────────
router.get("/vendors",           adminAuth, getAllVendors)
router.post("/update",           adminAuth, updateAdmin)
router.get("/profile",           adminAuth, getAdminProfile)
router.delete("/vendors/:id",    adminAuth, deleteVendor)
router.get("/vendors/:id",       adminAuth, getVendorById)
router.post("/update-profile",   adminAuth, updateProfile)
router.post("/change-password",  adminAuth, changePassword)

module.exports = router