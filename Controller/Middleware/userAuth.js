const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({ message: 'No token authorization denied'});

    }
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.json({ message: 'No token, authorization denied'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.json({ message: 'Token is not valid' });
    }    
    }

    module.exports = userAuth;