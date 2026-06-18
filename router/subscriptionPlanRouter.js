const express        = require("express");
const router         = express.Router();
const vendorAuth     = require("../Controller/Middleware/vendorAuth");
const adminAuth      = require("../Controller/Middleware/adminAuth");
const planController = require("../Controller/subscription/subscriptionPlanController");
const {
  createPlan,
  getAllPlans,
  subscribePlan,
  getMyPlan,
  cancelPlan,
  getAllPlansAdmin,
  togglePlanStatus,
  getPurchasedPlans
} = require("../Controller/subscription/subscriptionPlanController");

// ── ADMIN ROUTES ───────────────────────────────────────────
// POST http://localhost:5000/api/plans/create
router.post("/create", adminAuth, createPlan);

//GET http://localhost:5000/api/plans/admin/all
router.get("/admin/all",  adminAuth, getAllPlansAdmin); 

// ✅ Toggle plan status
//PUT http://localhost:5000/api/plans/toggle-status/PLAN_ID_HERE
router.put("/toggle-status/:id", adminAuth, togglePlanStatus)

// GET http://localhost:5000/api/plans/plan/:id
router.get("/plan/:id",adminAuth, planController.getPlanById);

// GET http://localhost:5000/api/plans/all
router.get("/all", getAllPlans); 

//GET http://localhost:5000/api/plans/purchased-plans
router.get("/purchased-plans", adminAuth, getPurchasedPlans)

// ── VENDOR ROUTES

// POST http://localhost:5000/api/plans/subscribe
router.post("/subscribe", vendorAuth, subscribePlan);
// GET http://localhost:5000/api/plans/my-plan
router.get("/my-plan",    vendorAuth, getMyPlan);
// POST http://localhost:5000/api/plans/cancel    
router.post("/cancel",    vendorAuth, cancelPlan);

module.exports = router;