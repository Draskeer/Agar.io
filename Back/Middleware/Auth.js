const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Please authenticate." });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification error: ", error.message);
        return res.status(401).json({ message: "Invalid token." });
    }
};

module.exports = auth;