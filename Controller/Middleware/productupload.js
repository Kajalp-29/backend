const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createUpload = (folder) => {
    // ✅ Auto-create folder dynamically
    const uploadPath = path.join(__dirname, "..", "..", "uploads", folder);
    
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const uniqueName = Date.now() + "-" + file.originalname;
            cb(null, uniqueName);
        }
    });

    return multer({ storage }); // ✅ returns multer instance
};

module.exports = createUpload; // ✅ export function
