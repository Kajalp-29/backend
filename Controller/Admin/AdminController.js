const Admin  = require("../../Model/Admin");
const Vendor = require("../../Model/Vendor");
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const crypto = require("crypto");

// ── CREATE ADMIN ──────────────────────────────────────────────────────────────
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, Email and Password are required" });
    }
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existingAdmin) {
      return res.status(409).json({ success: false, message: "Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email: email.toLowerCase().trim(), password: hashedPassword });
    await admin.save();
    res.status(201).json({ success: true, message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── ADMIN LOGIN ───────────────────────────────────────────────────────────────
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and Password are required" });
    }
    // ✅ lowercase trim to avoid case mismatch
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ALL VENDORS ───────────────────────────────────────────────────────────
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json({ success: true, message: "Vendor list", vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── UPDATE ADMIN ──────────────────────────────────────────────────────────────
exports.updateAdmin = async (req, res) => {
  try {
    const updateData = { name: req.body.name, email: req.body.email };
    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }
    const updatedAdmin = await Admin.findByIdAndUpdate(req.admin.id, updateData, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.status(200).json({ success: true, message: "Admin updated successfully", data: updatedAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE VENDOR ─────────────────────────────────────────────────────────────
exports.deleteVendor = async (req, res) => {
  try {
    const deleted = await Vendor.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.status(200).json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET SINGLE VENDOR ─────────────────────────────────────────────────────────
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.status(200).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ADMIN PROFILE ─────────────────────────────────────────────────────────
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── UPDATE PROFILE ────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }
    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { name, email, phone },
      { new: true }
    );
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    res.status(200).json({ success: true, message: "Profile updated successfully", admin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── CHANGE PASSWORD ───────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // ✅ Always lowercase+trim before DB lookup
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "No admin account found with this email"
      });
    }

    // ✅ Generate plain random token — stored directly (no hashing)
    const token     = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes

    await Admin.findByIdAndUpdate(admin._id, {
      $set: {
        resetPasswordToken:   token,
        resetPasswordExpires: expiresAt,
      }
    });

    const resetURL = `http://localhost:5173/admin/reset-password/${token}`;

    // ✅ Console only — not sent to email, not shown on screen
    console.log("🔗 Admin Password Reset URL:", resetURL);

    res.status(200).json({
      success:    true,
      message:    "Password reset link has been generated. Check server console.",
      resetURL,
      resetToken: token,
    });

  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── RESET PASSWORD ────────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { token }       = req.params;
    const { newPassword } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }
    if (!newPassword) {
      return res.status(400).json({ success: false, message: "New password is required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // ✅ Find by plain token and check expiry
    const admin = await Admin.findOne({
      resetPasswordToken:   token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      const expiredAdmin = await Admin.findOne({ resetPasswordToken: token });
      if (expiredAdmin) {
        return res.status(400).json({
          success: false,
          message: "Reset link has expired. Please request a new one."
        });
      }
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid. Please request a new one."
      });
    }

    // ✅ Update password and clear token
    await Admin.findByIdAndUpdate(admin._id, {
      $set:   { password: await bcrypt.hash(newPassword, 10) },
      $unset: { resetPasswordToken: "", resetPasswordExpires: "" }
    });

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in."
    });

  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};