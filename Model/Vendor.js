const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  businessName: String,
  email:        String,
  password:     String,
  phone:        String,
  address:      String,

  // ✅ Add these 3 fields
  subscribed_plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subscriptionPlan",  // ← matches your module.exports name exactly
    default: null
  },
  plan_start:  { type: Date, default: null },
  plan_expiry: { type: Date, default: null },
  resetPasswordToken:  { type: String, default: undefined },
  resetPasswordExpiry: { type: Date,   default: undefined },

}, { timestamps: true });

module.exports = mongoose.model("Vendor", vendorSchema);