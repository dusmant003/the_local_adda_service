const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/db');

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "all fields are required",
                success: false
            });
        }

        // Find admin by email
        const admin = await executeQuery(
            `SELECT * FROM admins WHERE email = ?`,
            [email]
        );

        if (admin.length === 0) {
            return res.status(400).json({
                message: "admin not found",
                success: false
            });
        }

        // Compare password with stored hashed password
        const isPasswordValid = await bcrypt.compare(
            password,
            admin[0].password
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "invalid password",
                success: false
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: admin[0].id,
                role: admin[0].role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Success response
        return res.status(200).json({
            message: "admin logged in successfully",
            success: true,
            admin: {
                id: admin[0].id,
                name: admin[0].name,
                email: admin[0].email,
                role: admin[0].role
            },
            token
        });

    } catch (error) {
        console.error("admin login error:", error.message);

        return res.status(500).json({
            message: "internal server error",
            success: false
        });
    }
};

module.exports = {
    adminLogin
};