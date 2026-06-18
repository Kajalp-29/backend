const Category = require("../../Model/Category");

// Add Category
exports.addCategory = async (req, res) => {
    try {
        const { cat_name } = req.body;

        if (!cat_name) {
            return res.json({ status: 0, message: "Category name is required" });
        }

        const category = new Category({
            cat_name,
            added_by: req.vendor.id  
        });

        await category.save();

        res.json({ status: 1, message: "Category Added Successfully" });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};


// View Category
exports.viewCategory = async (req, res) => {
    try {
        const categories = await Category.find({
            added_by: req.vendor.id
        });

        res.json({ status: 1, data: categories });

    } catch (error) {
        res.json({ status: 0, message: error.message });
    }
};

// TOGGLE STATUS
exports.toggleStatus = async (req, res) => {
  try {
    const { id }     = req.params
    const { status } = req.body

    console.log("Toggle ID:", id)      
    console.log("New Status:", status)   

    const updated = await Category.findByIdAndUpdate(
      id,
      { cat_status: status },
      { new: true }
    )
    console.log("Updated:", updated)     

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      })
    }

    res.status(200).json({
      success: true,
      message: `Category ${status === "active" ? "enabled" : "disabled"} successfully`,
      data: updated
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Category.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Category not found" })
    }
    res.status(200).json({ success: true, message: "Category deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}