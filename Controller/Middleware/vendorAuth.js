const jwt = require("jsonwebtoken");

const vendorAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token received:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.vendor = decoded;

    next();

  } catch (error) {
    console.log("JWT Error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = vendorAuth;