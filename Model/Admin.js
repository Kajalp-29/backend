const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    { type: String },
  role:     { type: String, default: "admin" },

  // ✅ Required for forgot/reset password
  resetPasswordToken:   { type: String, default: null },
  resetPasswordExpires: { type: Date,   default: null },

}, { timestamps: true })

module.exports = mongoose.model("Admin", adminSchema)