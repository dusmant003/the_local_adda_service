const jwt = require('jsonwebtoken');

const adminMiddleWare = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization token is required",
                success: false
            })
        }
        // get token
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "unauthorized token",
                success: false
            })
        }
        // verify jwt token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // check admin role
        if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
            return res.status(403).json({
                message: "Admin access required",
                success: false
            });
        }

        // store user information in request
        req.user = decoded;
        // continue to next middleware
        next();


    } catch (error) {
        console.error("admin auth middleware error:", error.message);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

module.exports = adminMiddleWare;