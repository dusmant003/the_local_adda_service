const bcrypt = require('bcrypt');
const { executeQuery } = require('../config/db');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // 1. Validate required fields

        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                message: "all fileds are required",
                success: false
            })
        }
        // check if emial already exists
        const existingUser = await executeQuery(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                message: "Email already registered",
                success: false
            })
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert user into database
        const result = await executeQuery(
            "INSERT INTO users (name, email, password, phone) VALUES (?, ? ,?, ?)",
            [name, email, hashedPassword, phone]
        );

        // return success response
        return res.status(200).json({
            message: "user registered successfully",
            success: true,
            user: {
                id: result.insertId,
                name,
                email,
                phone
            }
        })


    } catch (error) {
        console.error("register error:", error.message)
        return res.status(500).json({
            message: "internal server error",
            success: false
        })

    }
}

module.exports = {
    registerUser
}