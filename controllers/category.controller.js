const db = require('../config/db');


// Create Category
const createCategory = async (req, res) => {
    try {

        // Get text fields from form-data
        const { name, description } = req.body;


        // Get uploaded image from Multer
        const image = req.file ? req.file.filename : null;


        // Check category name
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }


        // Check if category already exists
        const existingCategory = await db.executeQuery(
            "SELECT id FROM categories WHERE name = ?",
            [name]
        );


        // If category already exists
        if (existingCategory.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }


        // Insert category into database
        const result = await db.executeQuery(
            `INSERT INTO categories (name, description, image)
             VALUES (?, ?, ?)`,
            [name, description || null, image]
        );


        // Send success response
        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            categoryId: result.insertId,
            image: image
        });


    } catch (error) {

        // Show complete error in VS Code terminal
        console.error("Create category error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    createCategory
};