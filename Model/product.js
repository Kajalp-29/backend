const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    pro_name: {
        type: String,
        required: true
    },
    purchase_price: {
        type: Number,
        required: true
    },
    sale_price: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    gst_rate: {
        type: Number,
        default: 0
    },
    purchase_gst: {
        type: Number,
        default: 0
    },
    hsn_code: String,
    alert_qty: {
        type: Number,
        default: 0
    },
    barcode_number: {
        type: String,
        unique: true,
        required: true
    },
    pro_status: {
  type: String,
  enum: ["Active", "Inactive"],
  default: "Active"
},

    image:{
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);