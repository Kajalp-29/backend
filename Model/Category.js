const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    cat_name: {
        type: String,
        required: true,
        trim: true
    },
    cat_status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);