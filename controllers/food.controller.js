const db = require('../config/db');


// Create a new food
const createFood = async (req, res) => {
    try {

        // Get text fields from form-data
        const {
            category_id,
            name,
            description,
            price
        } = req.body;


        // Get uploaded image from Multer
        const image = req.file ? req.file.filename : null;


        // Check required fields
        if (!category_id || !name || !price) {
            return res.status(400).json({
                success: false,
                message: "Category, food name and price are required"
            });
        }


        // Check if category exists
        const category = await db.executeQuery(
            `SELECT id FROM categories WHERE id = ?`,
            [category_id]
        );

        if (category.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }


        // Check if food already exists
        const existingFood = await db.executeQuery(
            `SELECT id FROM foods
             WHERE name = ? AND category_id = ?`,
            [name, category_id]
        );

        if (existingFood.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Food already exists"
            });
        }


        // Insert food into database
        const result = await db.executeQuery(
            `INSERT INTO foods
            (category_id, name, description, price, image)
            VALUES (?, ?, ?, ?, ?)`,
            [
                category_id,
                name,
                description || null,
                price,
                image
            ]
        );


        // Success response
        return res.status(201).json({
            success: true,
            message: "Food created successfully",
            foodId: result.insertId,
            image: image
        });

    } catch (error) {

        console.error("Create food error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    createFood
};