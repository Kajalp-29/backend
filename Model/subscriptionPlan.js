const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema(
  {
    plan_name: {
      type: String,
      required: true,
    },
    plan_duration: {
      type: Number,
      required: true,
    },
    plan_price: {
      type: Number,
      required: true,
    },
    plan_status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    // ✅ Remove plan_start and plan_expiry from here
    // These belong on Vendor, not on the plan itself
  },
  { timestamps: true }
);

module.exports = mongoose.model("subscriptionPlan", subscriptionPlanSchema);