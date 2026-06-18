const UserModel = require("../Model/User");

//  ADD USER 
exports.addUser = async (req, res) => {
    try {

        const {
            username,
            mobile,
            email,
            address,
            city,
            state,
            pincode,
            gst_no,
            company_name
        } = req.body;

        if (!username || !mobile) {
            return res.json({
                status: 0,
                message: "Username and mobile are required"
            });
        }

        const existingUser = await UserModel.findOne({
            vendor_id: req.vendor.id,
            mobile: mobile.trim()
        });

        if (existingUser) {
            return res.json({
                status: 0,
                message: "Mobile already exists"
            });
        }

        const newUser = new UserModel({
            vendor_id: req.vendor.id,
            username: username.trim(),
            mobile: mobile.trim(),
            email,
            address,
            city,
            state,
            pincode,
            gst_no,
            company_name
        });

        await newUser.save();

        res.json({
            status: 1,
            message: "User added successfully",
            data: newUser
        });

    } catch (error) {
        res.json({
            status: 0,
            message: error.message
        });
    }
};



//  VIEW USERS 
exports.viewUsers = async (req, res) => {
    try {

        const users = await UserModel.find({
            vendor_id: req.vendor.id
        }).sort({ createdAt: -1 });

        res.json({
            status: 1,
            data: users
        });

    } catch (error) {
        res.json({
            status: 0,
            message: error.message
        });
    }
};