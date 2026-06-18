const Razorpay = require("razorpay");
const crypto   = require("crypto");
const Payment  = require("../../Model/payment");
const Plan     = require("../../Model/subscriptionPlan");
const Vendor   = require("../../Model/Vendor"); 

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount:   amount * 100,
      currency: "INR",
      receipt:  "receipt_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
};

// ✅ Verify Payment — Switch + Renew + Cancel support
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan_id,
      is_switch, // frontend se aayega
      is_renew   // frontend se aayega
    } = req.body;

    const vendor_id = req.vendor?.id || req.vendor?._id;

    if (!vendor_id) {
      return res.status(401).json({ message: "Unauthorized: vendor not found" });
    }

    // 🔐 Signature verify karo
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Signature mismatch" });
    }

    // 📦 Plan find karo
    const plan = await Plan.findById(plan_id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // 💾 Payment save karo
    await Payment.create({
      vendor_id,
      plan_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: plan.plan_price,
      status: "success",
    });

    // 📅 Plan dates calculate karo
    const vendor = await Vendor.findById(vendor_id);

    let plan_start  = new Date();
    let plan_expiry = new Date();

    if (is_renew && vendor?.plan_expiry && new Date(vendor.plan_expiry) > new Date()) {
      // ✅ RENEW: existing expiry se aage badhao
      plan_start  = new Date(vendor.plan_expiry);
      plan_expiry = new Date(vendor.plan_expiry);
      plan_expiry.setMonth(plan_expiry.getMonth() + plan.plan_duration);
    } else {
      // ✅ NEW PLAN ya SWITCH PLAN: aaj se shuru
      plan_start  = new Date();
      plan_expiry = new Date();
      plan_expiry.setMonth(plan_expiry.getMonth() + plan.plan_duration);
    }

    // 🔥 Vendor update karo — YAHAN VENDOR HAI, USER NAHI ✅
    await Vendor.findByIdAndUpdate(vendor_id, {
      subscribed_plan: plan._id,  // ✅ sahi field name (Vendor model check karo)
      plan_start,
      plan_expiry,
    });

    res.json({
      success: true,
      message: is_renew ? "Plan renewed successfully" :
                is_switch ? "Plan switched successfully" :
                "Payment successful & plan activated"
    });

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};