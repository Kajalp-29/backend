const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true
    },

    business_name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    phone_one: {
      type: String
    },
    phone_two: {
      type: String
    },

    address_one: {
      type: String
    },

    address_two: {
      type: String
    },

    address_three: {
      type: String
    },

    address_four: {
      type: String
    },

    state: {
      type: String
    },

    city: {
      type: String
    },

    pincode: {
      type: String
    },

    gst: {
      type: String
    },

    logo: {
      type: String   
    },
    
    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);