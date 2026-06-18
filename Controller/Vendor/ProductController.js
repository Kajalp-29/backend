const Product = require("../../Model/product");
const Category = require("../../Model/Category");

// Generate barcode
const generateBarcode = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

// Add Product
exports.addProduct = async (req, res) => {
    try {

         console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        console.log("VENDOR:", req.vendor);
        const {
            category_id,
            pro_name,
            purchase_price,
            sale_price,
            qty,
            gst_rate,
            hsn_code,
            alert_qty
        } = req.body;

        const vendor_id = req.vendor.id;
        
        // 👇 Get image filename if uploaded
        const image = req.file ? req.file.filename : null;



        if (!category_id || !pro_name || purchase_price == null || sale_price == null || qty == null) {
            return res.json({ status: 0, message: "Required fields missing" ,
            received: req.body
        });

        }

        const purchasePrice = Number(purchase_price);
        const salePrice = Number(sale_price);
        const quantity = Number(qty);
        const gstRate = Number(gst_rate) || 0;

        if (salePrice < purchasePrice) {
            return res.json({ status: 0, message: "Sale price must be greater than purchase price" });
        }

        const calculatedGST = (purchasePrice * gstRate) / 100;

        let barcode,  exists;
        do {
            barcode = generateBarcode();
            exists = await Product.findOne({ barcode_number: barcode });
        } while (exists);
         
        
        const product = new Product({
            category_id,
            vendor_id,
            pro_name,
            purchase_price: purchasePrice,
            sale_price: salePrice,
            qty: quantity,
            gst_rate: gstRate,
            purchase_gst: calculatedGST,
            hsn_code,
            alert_qty,
            barcode_number: barcode,
            image  // SAVE IMG NAME     
        });

        await product.save();

        res.json({ status: 1, message: "Product Added Successfully", data: product });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};

// View Products
exports.viewProducts = async (req, res) => {
    try {
        const vendor_id = req.vendor.id;

        const products = await Product.find({ vendor_id })
            .populate("category_id", "cat_name");

        res.json({ status: 1, data: products });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};

// TOGGLE STATUS
exports.toggleStatus = async (req, res) => {
  try {
    const { id }     = req.params
    const { status } = req.body

    const updated = await Product.findOneAndUpdate(
      { _id: id, vendor_id: req.vendor.id },
      { pro_status: status },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.status(200).json({
      success: true,
      message: `Product ${status === "Active" ? "enabled" : "disabled"} successfully`,
      data: updated
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Product.findOneAndDelete({
      _id: id,
      vendor_id: req.vendor.id
    })
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const vendor_id = req.vendor.id

    const {
      pro_name,
      purchase_price,
      sale_price,
      qty,
      gst_rate,
      alert_qty,
      barcode_number,
      hsn_code
    } = req.body

    // Validate sale price
    if (Number(sale_price) < Number(purchase_price)) {
      return res.status(400).json({ status: 0, message: "Sale price must be greater than purchase price" })
    }

    const updated = await Product.findOneAndUpdate(
      { _id: id, vendor_id },        // ✅ only update vendor's own product
      {
        pro_name,
        purchase_price: Number(purchase_price),
        sale_price:     Number(sale_price),
        qty:            Number(qty),
        gst_rate:       Number(gst_rate) || 0,
        alert_qty:      Number(alert_qty) || 0,
        barcode_number,
        hsn_code,
        purchase_gst: (Number(purchase_price) * Number(gst_rate)) / 100
      },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ status: 0, message: "Product not found" })
    }

    res.status(200).json({ status: 1, message: "Product updated successfully", data: updated })

  } catch (error) {
    res.status(500).json({ status: 0, message: error.message })
  }
}