const mongoose = require("mongoose")

const billItemSchema = new mongoose.Schema({
  pro_name:    { type: String, required: true },
  qty:         { type: Number, required: true },
  sale_price:  { type: Number, required: true },
  gst_rate:    { type: Number, default: 0 },
  gst_amount:  { type: Number, default: 0 },
  total:       { type: Number, required: true }
})

const billSchema = new mongoose.Schema({
  vendor_id:       { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  customer_name:   { type: String, required: true },
  customer_mobile: { type: String, default: "" },
  bill_number:     { type: String, unique: true },
  items:           [billItemSchema],
  subtotal:        { type: Number, required: true },
  total_gst:       { type: Number, default: 0 },
  grand_total:     { type: Number, required: true },
  payment_type:    { type: String, enum: ["Cash", "Online"], required: true },
  payment_status:  { type: String, enum: ["Paid", "Unpaid", "Partial"], default: "Unpaid" },
  notes:           { type: String }
}, { timestamps: true })

module.exports = mongoose.model("Bill", billSchema)























