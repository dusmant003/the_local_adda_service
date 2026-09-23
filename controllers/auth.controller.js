const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

// login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validate required fields

        if (!email || !password) {
            return res.status(400).json({
                message: "all fields are required",
                success: false
            })
        }


        // fins user by email
        const user = await executeQuery(
            `SELECT * FROM users WHERE email =?`,
            [email]
        );

        if (user.length === 0) {
            return res.status(400).json({
                message: "user not found",
                success: false
            })
        }

        // compare password

        const isPasswordValid = await bcrypt.compare(password, user[0].password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "invalid password",
                success: false
            })
        }
        // create jwt token
        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
            expiresIn: "7d"

        });

        // return success response
        return res.status(200).json({
            message: "user logged in successfully",
            success: true,
            user: {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email,
                phone: user[0].phone
            },
            token
        })

    } catch (error) {
        console.error("login error:", error.message)
        return res.status(500).json({
            message: "internal server error",
            success: false
        })

    }
}

// getProfile

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await executeQuery(
            `SELECT id , name , email , phone FROM users WHERE id = ?`,
            [userId]
        );
        if (user.lenth === 0) {
            return res.status(404).json({
                message: "user not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "user profile fetched successfully",
            success: true,
            user: {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email,
                phone: user[0].phone
            }
        });

    } catch (error) {
        console.error("get profile error:", error.message);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

// updateProfile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                message: "all fields are required",
                success: false
            });
        }

        // update user profile
        const result = await executeQuery(
            `UPDATE users SET name = ?, phone = ? WHERE id = ?`,
            [name, phone, userId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "user not found",
                success: false
            });
        }
        // return success response
        return res.status(200).json({
            message: "user profile updated successfully",
            success: true,
            user: {
                id: userId,
                name,
                phone
            }
        });

    } catch (error) {
        console.error("updateProfile error:", error.message);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
}