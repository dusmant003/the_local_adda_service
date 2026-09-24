// Import executeQuery function for executing MySQL queries
const { executeQuery } = require('../config/db');


// Create a new category
const createCategory = async (req, res) => {
    try {

        // Get category data from request body
        const { name, description } = req.body;


        // Check if category name is provided
        // Category name is a required field
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }


        // Check if the category already exists in the database
        const [existingCategory] = await executeQuery(
            "SELECT id FROM categories WHERE name = ?",
            [name]
        );


        // If category already exists, don't create it again
        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }


        // Insert the new category into the database
        const [result] = await executeQuery(
            `INSERT INTO categories (name, description)
             VALUES (?, ?)`,
            [name, description || null]
        );


        // Send successful response
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            categoryId: result.insertId
        });


    } catch (error) {

        // Show error in terminal for debugging
        console.error("Create category error:", error);


        // Send server error response
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Export controller function
module.exports = {
    createCategory
};