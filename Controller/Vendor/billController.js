const Bill = require("../../Model/bill")

const generateBillNumber = () => {
  const date = new Date()
  const yy   = date.getFullYear().toString().slice(-2)
  const mm   = String(date.getMonth() + 1).padStart(2, "0")
  const dd   = String(date.getDate()).padStart(2, "0")
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `BILL-${yy}${mm}${dd}-${rand}`
}

// ✅ CREATE BILL
exports.createBill = async (req, res) => {
  try {
    const vendor_id = req.vendor.id
    const {
      customer_name,
      customer_mobile,
      items,
      payment_type,
      payment_status,
      notes
    } = req.body

    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({ success: false, message: "Customer name is required" })
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "At least one item is required" })
    }

    let subtotal  = 0
    let total_gst = 0
    const billItems = []

    for (const item of items) {
      const qty        = Number(item.qty)        || 1
      const sale_price = Number(item.sale_price) || 0
      const gst_rate   = Number(item.gst_rate)   || 0
      const gst_amount = (sale_price * qty * gst_rate) / 100
      const total      = (sale_price * qty) + gst_amount

      subtotal  += sale_price * qty
      total_gst += gst_amount

      billItems.push({
        pro_name:  item.pro_name || "—",
        qty,
        sale_price,
        gst_rate,
        gst_amount,
        total
      })
    }

    const grand_total = subtotal + total_gst
    const bill_number = generateBillNumber()

    const bill = await Bill.create({
      vendor_id,
      customer_name:   customer_name.trim(),
      customer_mobile: customer_mobile || "",
      bill_number,
      items:          billItems,
      subtotal,
      total_gst,
      grand_total,
      payment_type,
      payment_status: payment_status || "Paid",
      notes
    })

    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      data: bill
    })

  } catch (error) {
    console.error("Create Bill Error:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ GET ALL BILLS
exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ vendor_id: req.vendor.id })
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: bills })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ GET SINGLE BILL
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findOne({
      _id: req.params.id,
      vendor_id: req.vendor.id
    })
    if (!bill) {
      return res.status(404).json({ success: false, message: "Bill not found" })
    }
    res.status(200).json({ success: true, data: bill })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ DELETE BILL
exports.deleteBill = async (req, res) => {
  try {
    const deleted = await Bill.findOneAndDelete({
      _id: req.params.id,
      vendor_id: req.vendor.id
    })
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Bill not found" })
    }
    res.status(200).json({ success: true, message: "Bill deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

