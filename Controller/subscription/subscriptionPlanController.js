const SubscriptionPlan = require("../../Model/subscriptionPlan");
const Vendor           = require("../../Model/Vendor");

// CREATE PLAN
exports.createPlan = async (req, res) => {
  try {
    const { plan_name, plan_price, plan_duration, plan_status } = req.body;
    const admin_id = req.admin.id;
    if (!plan_name || !plan_price || !plan_duration) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }
    const plan = await SubscriptionPlan.create({
      plan_name, plan_price, plan_duration,
      plan_status: plan_status || "active",
      admin_id
    });
    res.status(201).json({ success: true, message: "Plan created", data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ACTIVE PLANS — Vendor ke liye
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ plan_status: "active" });
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL PLANS — Admin ke liye
exports.getAdminAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SUBSCRIBE PLAN
exports.subscribePlan = async (req, res) => {
  try {
    const { plan_id, is_switch, is_renew } = req.body;
    const vendor_id = req.vendor?.id || req.vendor?._id;

    const plan = await SubscriptionPlan.findById(plan_id);
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

    const vendor = await Vendor.findById(vendor_id);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    let plan_start  = new Date();
    let plan_expiry = new Date();

    if (is_renew && vendor?.plan_expiry && new Date(vendor.plan_expiry) > new Date()) {
      plan_start  = new Date(vendor.plan_expiry);
      plan_expiry = new Date(vendor.plan_expiry);
      plan_expiry.setMonth(plan_expiry.getMonth() + plan.plan_duration);
    } else {
      plan_expiry.setMonth(plan_expiry.getMonth() + plan.plan_duration);
    }

    await Vendor.findByIdAndUpdate(vendor_id, {
      $set: { subscribed_plan: plan._id, plan_start, plan_expiry }
    });

    res.status(200).json({
      success: true,
      message: is_renew  ? "Plan renewed successfully" :
               is_switch ? "Plan switched successfully" :
                           "Plan subscribed successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET MY PLAN
exports.getMyPlan = async (req, res) => {
  try {
    const vendor_id = req.vendor?.id || req.vendor?._id;
    const vendor = await Vendor.findById(vendor_id).populate("subscribed_plan");

    if (!vendor) return res.status(200).json({ success: true, data: null });
    if (!vendor.subscribed_plan) return res.status(200).json({ success: true, data: null });

    res.status(200).json({
      success: true,
      data: {
        plan_id:    vendor.subscribed_plan._id,
        plan_name:  vendor.subscribed_plan.plan_name,
        plan_start: vendor.plan_start,
        plan_end:   vendor.plan_expiry,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CANCEL PLAN
exports.cancelPlan = async (req, res) => {
  try {
    const vendor_id = req.vendor?.id || req.vendor?._id;

    const vendor = await Vendor.findById(vendor_id);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    vendor.subscribed_plan = null;
    vendor.plan_start      = null;
    vendor.plan_expiry     = null;
    await vendor.save();

    res.status(200).json({ success: true, message: "Plan cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET PLAN BY ID
exports.getPlanById = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Admin — sab plans (active + inactive)
exports.getAllPlansAdmin = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find()
      .populate("admin_id", "name email")
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: plans })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Vendor — sirf active plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ plan_status: "active" })
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: plans })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
// ✅ Toggle plan status
exports.togglePlanStatus = async (req, res) => {
  try {
    const { plan_status } = req.body
    const plan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      { plan_status },
      { new: true }
    )
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" })
    res.status(200).json({
      success: true,
      message: `Plan ${plan_status} successfully`,
      data: plan
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET ALL PURCHASED PLANS
exports.getPurchasedPlans = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .populate("subscribed_plan", "plan_name plan_price plan_duration")
      .select("name email subscribed_plan plan_start plan_expiry")
      .sort({ createdAt: -1 })

    console.log("Total vendors found:", vendors.length) // ← check this in terminal

    const data = vendors.map(v => ({
      _id:           v._id,
      vendor_name:   v.name,
      vendor_email:  v.email,
      plan_name:     v.subscribed_plan?.plan_name    || null,
      plan_price:    v.subscribed_plan?.plan_price   || null,
      plan_duration: v.subscribed_plan?.plan_duration || null,
      plan_start:    v.plan_start  || null,
      plan_expiry:   v.plan_expiry || null,
    }))

    console.log("Data being sent:", JSON.stringify(data[0])) // ← check first item

    res.status(200).json({ success: true, data })
  } catch (error) {
    console.error("getPurchasedPlans error:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}