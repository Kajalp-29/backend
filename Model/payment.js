const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    amount: Number,
    status: {
      type: String,
      default: "success",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);