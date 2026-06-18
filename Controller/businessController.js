const Business = require("../Model/business");

// CREATE BUSINESS
const createBusiness = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("VENDOR:", req.vendor);

    const vendor_id = req.vendor.id;

    const {
      business_name, email, phone_one, phone_two,
      address_one, address_two, address_three, address_four,
      status, state, city, pincode, gst
    } = req.body;

    if (!business_name || !email) {
      return res.status(400).json({
        success: false,
        message: "Business name and email are required"
      });
    }

    // ✅ Create or Update (upsert) — no more "already exists" error
    const business = await Business.findOneAndUpdate(
      { vendor_id },
      {
        vendor_id,
        business_name, email, phone_one, phone_two,
        address_one, address_two, address_three, address_four,
        status, state, city, pincode, gst,
        logo: req.file ? req.file.filename : null
      },
      { new: true, upsert: true }  // ✅ create if not exists, update if exists
    );

    res.status(200).json({
      success: true,
      message: "Business saved successfully",
      data: business
    });

  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE BUSINESS
const updateBusiness = async (req, res) => {
  try {
    const vendor_id = req.vendor.id;

    const {
      business_name, email, phone_one, phone_two,
      address_one, address_two, address_three, address_four,
      status, state, city, pincode, gst
    } = req.body;

    const business = await Business.findOneAndUpdate(
      { vendor_id },
      {
        business_name, email, phone_one, phone_two,
        address_one, address_two, address_three, address_four,
        status, state, city, pincode, gst,
        ...(req.file && { logo: req.file.filename }) // ✅ only update logo if new file uploaded
      },
      { new: true }
    );

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    res.status(200).json({
      success: true,
      message: "Business updated successfully",
      data: business
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET MY BUSINESS
const getMyBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ vendor_id: req.vendor.id });

    if (!businesses || businesses.length === 0) {
      return res.status(404).json({ success: false, message: "No business found" });
    }

    const baseURL = "http://localhost:5000";
    const businessWithLogo = businesses.map(b => ({
      ...b._doc,
      logo_url: b.logo ? `${baseURL}/uploads/business/${b.logo}` : null // ✅ full logo URL
    }));

    res.status(200).json({
      success: true,
      total: businesses.length,
      businesses: businessWithLogo
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBusiness, updateBusiness, getMyBusinesses };