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
// getAdminProfile

const getAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.id;

        const [admin] = await executeQuery(
            'SELECT id, name, email, role FROM admins WHERE id = ?',
            [adminId]
        );

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Admin profile fetched successfully',
            admin
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// getAllUser 
const getAllUsers = async (req, res) => {
    try {
        const users = await executeQuery(
            `SELECT id, name,email, created_at
             FROM users 
            ORDER BY id DESC`
        );

        return res.status(200).json({
            message: "users fetched successfully",
            success: true,
            users
        })

    } catch (error) {
        console.error("get all users:", error)
        return res.status(500).json({
            message: "internal server error",
            success: false
        })

    }
}

// getUserById
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await executeQuery(
            `SELECT id , name , email , phone , created_at FROM users WHERE id = ?`,
            [userId]
        );

        if (user.length === 0) {
            return res.status(404).json({
                message: "user not found",
                success: false
            });
        }

        // success response
        return res.status(200).json({
            message: "user fetched successfully",
            success: true,
            user
        })

    } catch (error) {
        console.error("get user by id:", error);
        return res.status(500).json({
            message: "internal server error",
            success: false
        });
    }
}

// delete User
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await executeQuery(
            `DELETE FROM users WHERE id = ?`,
            [userId]
        )
        if (user.affectedRows === 0) {
            return res.status(404).json({
                message: "user not found",
                success: false
            });
        }

        // success response
        return res.status(200).json({
            message: "user deleted successfully",
            success: true
        })

    } catch (error) {
        console.error("delete user error:", error);
        return res.status(500).json({
            message: "internal server error",
            success: false
        });
    }
}

module.exports = {
    adminLogin,
    getAdminProfile,
    getAllUsers,
    getUserById,
    deleteUser
};