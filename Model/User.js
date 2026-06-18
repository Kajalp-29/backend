const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },

    username: {
        type: String,
        required: true,
        trim: true
    },

    mobile: {
        type: String,
        required: true
    },

    email: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    gst_no: String,
    company_name: String

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
