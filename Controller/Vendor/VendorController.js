const Vendor = require("../../Model/Vendor");
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const crypto = require("crypto"); // ✅ built-in Node.js, no install needed

// 🔹 Vendor Register
exports.registerVendor = async (req, res) => {
  try {
    const { businessName, email, password, phone, address } = req.body;
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) return res.status(400).json({ message: "Vendor already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = new Vendor({ businessName, email, password: hashedPassword, phone, address });
    await vendor.save();
    res.status(201).json({ message: "Vendor Registered Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Vendor Login
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(400).json({ message: "Vendor Not Found" });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign(
      { id: vendor._id, role: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Vendor Login Successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET vendor profile
exports.getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id).select("-password -resetPasswordToken -resetPasswordExpiry");
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.status(200).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE vendor profile
exports.updateVendorProfile = async (req, res) => {
  try {
    const { businessName, email, phone, address } = req.body;
    if (!businessName || !email) {
      return res.status(400).json({ success: false, message: "Business name and email are required" });
    }
    const vendor = await Vendor.findByIdAndUpdate(
      req.vendor.id,
      { businessName, email, phone, address },
      { new: true }
    ).select("-password");
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.status(200).json({ success: true, message: "Profile updated successfully", vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CHANGE vendor password
exports.changeVendorPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const vendor = await Vendor.findById(req.vendor.id);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const isMatch = await bcrypt.compare(currentPassword, vendor.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Current password is incorrect" });

    vendor.password = await bcrypt.hash(newPassword, 10);
    await vendor.save();
    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const vendor = await Vendor.findOne({ email })
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    // ✅ Use crypto random token — NOT jwt (jwt is too long for bcrypt)
    const resetToken = crypto.randomBytes(32).toString("hex")

    // ✅ Store SHA256 hash in DB — compare SHA256 later (no bcrypt needed)
    vendor.resetPasswordToken  = crypto.createHash("sha256").update(resetToken).digest("hex")
    vendor.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 min
    await vendor.save()

    const resetURL = `http://localhost:5173/vendor/reset-password/${resetToken}`

    // ✅ Log to console only
    console.log("🔗 Reset URL:", resetURL)

    res.status(200).json({
      message:  "Reset token generated",
      resetURL, // frontend logs this, doesn't show on screen
    })

  } catch (error) {
    console.error("forgotPassword error:", error)
    res.status(500).json({ message: error.message })
  }
}

// 🔹 Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token }   = req.params
    const newPassword = req.body.newPassword || req.body.password

    if (!token)       return res.status(400).json({ message: "Token is required" })
    if (!newPassword) return res.status(400).json({ message: "New password is required" })

    // ✅ Hash the incoming token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    // 🔍 DEBUG — remove after fixing
    console.log("🔑 Raw token from URL:", token)
    console.log("🔒 Hashed token:", hashedToken)
    console.log("⏰ Current time:", new Date(Date.now()))

    // 🔍 Check what's in DB
    const vendorDebug = await Vendor.findOne({ resetPasswordToken: hashedToken })
    console.log("👤 Vendor found by token:", vendorDebug ? vendorDebug.email : "NOT FOUND")
    if (vendorDebug) {
      console.log("📅 Token expiry in DB:", vendorDebug.resetPasswordExpiry)
      console.log("✅ Is token expired?", vendorDebug.resetPasswordExpiry < Date.now())
    }

    const vendor = await Vendor.findOne({
      resetPasswordToken:  hashedToken,
      resetPasswordExpiry: { $gt: Date.now() }
    })

    if (!vendor) {
      return res.status(400).json({ message: "Invalid or expired reset token" })
    }

    vendor.password            = await bcrypt.hash(String(newPassword), 10)
    vendor.resetPasswordToken  = undefined
    vendor.resetPasswordExpiry = undefined
    await vendor.save()

    res.status(200).json({ message: "Password reset successfully" })

  } catch (error) {
    console.error("resetPassword error:", error)
    res.status(500).json({ message: error.message })
  }
}