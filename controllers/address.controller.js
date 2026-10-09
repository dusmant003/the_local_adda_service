const db = require('../config/db');


const AddAddress = async (req, res) => {
    try {
        // get logged-in user id from jwt
        const user_id = req.user.id;
        console.log("user_id:", user_id);

        const { full_name, phone, address, city, state, pincode } = req.body;

        // all fields are required
        if (!full_name || !phone || !address || !city || !state || !pincode) {
            return res.status(400).json({
                message: "all fields are required",
                success: false
            })
        }
        // check if address already exists
        const existingAddress = await db.executeQuery(
            `SELECT * FROM addresses WHERE user_id = ? AND full_name = ? AND phone = ? AND address = ? AND city = ? AND state = ? AND pincode = ?`,
            [user_id, full_name, phone, address, city, state, pincode]
        )

        if (existingAddress.length > 0) {
            return res.status(400).json({
                message: "address already exists",
                success: false
            })
        }

        // INSERT INTO address
        const result = await db.executeQuery(
            `INSERT INTO addresses (user_id, full_name, phone, address, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user_id, full_name, phone, address, city, state, pincode]
        )

        // get new address
        const newAddress = await db.executeQuery(
            `SELECT * FROM addresses WHERE id = ?`,
            [result.insertId]
        );

        // return success response
        return res.status(200).json({
            message: "address addded successfully",
            success: true,
            address: newAddress[0]
        })

    } catch (error) {
        console.error('add address error:', error);
        return res.sattus(500).json({
            message: "internal server error",
            success: false
        })
    }
}

// getMyAddress
const getMyAddress = async (req, res) => {
    try {
        const user_id = req.user.id;
        console.log("user_id:", user_id);

        // Get all addresses of logged-in user
        const address = await db.executeQuery(
            `SELECT * FROM addresses WHERE user_id = ?`,
            [user_id]
        );

        if (address.length === 0) {
            return res.status(404).json({
                message: "address not found",
                success: false,
                address: []
            })
        }

        // return success response
        return res.status(200).json({
            message: "address fetched successfully",
            success: true,
            address
        })

    } catch (error) {
        console.error('get my address error:', error);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

//  getAddressById 
const getAddressById = async (req, res) => {
    try {

        // Get address ID from URL
        const { id } = req.params;

        console.log("address_id:", id);


        // Get logged-in user ID from JWT
        const user_id = req.user.id;

        console.log("user_id:", user_id);

        // get address by id
        const address = await db.executeQuery(
            `SELECT * FROM addresses WHERE id = ? AND user_id = ?`,
            [id, user_id]
        );

        if (address.length === 0) {
            return res.status(404).json({
                message: "address not found",
                success: false
            })
        }

        // return success response
        return res.status(200).json({
            message: "address fetched successfully",
            success: true,
            address: address[0]
        })

    } catch (error) {
        console.error('get address by id error:', error);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

// uodate Address
const updateAddress = async (req, res) => {
    try {

        // Get address ID from URL
        const { id } = req.params;

        console.log("address_id:", id);

        // Get logged-in user ID from JWT
        const user_id = req.user.id;

        console.log("user_id:", user_id);

        // Get updated address data from request body
        const {
            full_name,
            phone,
            address,
            city,
            state,
            pincode
        } = req.body;

        // Check if address exists for logged-in user
        const existingAddress = await db.executeQuery(
            `SELECT * FROM addresses
             WHERE id = ? AND user_id = ?`,
            [id, user_id]
        );

        // If address does not exist
        if (existingAddress.length === 0) {
            return res.status(404).json({
                message: "address not found",
                success: false
            });
        }

        // Update address
        const result = await db.executeQuery(
            `UPDATE addresses
             SET full_name = ?,
                 phone = ?,
                 address = ?,
                 city = ?,
                 state = ?,
                 pincode = ?
             WHERE id = ? AND user_id = ?`,
            [
                full_name,
                phone,
                address,
                city,
                state,
                pincode,
                id,
                user_id
            ]
        );

        console.log("update result:", result);

        // Get updated address
        const updatedAddress = await db.executeQuery(
            `SELECT * FROM addresses
             WHERE id = ? AND user_id = ?`,
            [id, user_id]
        );

        console.log("updated address:", updatedAddress);

        // Return success response
        return res.status(200).json({
            message: "address updated successfully",
            success: true,
            address: updatedAddress[0]
        });

    } catch (error) {
        console.error("update address error:", error.message);

        return res.status(500).json({
            message: "internal server error",
            success: false
        });
    }
};

// DeleteAddress
const DeleteAddress = async (req, res) => {
    try {

    } catch (error) {
        console.error("delete address error:", error.message);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })

    }
}

module.exports = {
    AddAddress,
    getMyAddress,
    getAddressById,
    updateAddress,
    DeleteAddress

}