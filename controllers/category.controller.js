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

// getAllCategories
const getAllCategories = async (req, res) => {
    try {
        const result = await db.executeQuery(
            `SELECT * FROM categories`
        );
        if (result && result.length > 0) {

            return res.status(200).json({
                success: true,
                message: "Categories fetched successfully",
                categories: result
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No categories found"
            });
        }

    } catch (error) {
        console.error('Get all categories error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });

    }
}

// getCategoryById
const getCategoryById = async (req, res) => {
    try {
        // Get category ID from URL
        const { id } = req.params;

        // Find category by ID
        const result = await db.executeQuery(
            `SELECT * FROM categories WHERE id = ?`,
            [id]
        );
        // Check if category exists
        if (result.length === 0) {
            return res.status(404).json({
                message: "category not found",
                success: false
            })
        }

        // success response
        return res.status(200).json({
            message: "category fetched successfully",
            success: true,
            category: result[0]
        })


    } catch (error) {
        console.error("get category by id error:", error.message);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

// updateCategorybyId

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // get upload image from multer
        const image = req.file ? req.file.name : null;

        // check if category exists
        const result = await db.executeQuery(
            `SELECT * FROM categories WHERE id = ?`,
            [id]
        );
        if (result.length === 0) {
            return res.status(404).json({
                message: "category not found",
                success: false
            })
        }

        // If new name is provided, check duplicate name
        const existingCategory = await db.executeQuery(
            `SELECT id FROM categories WHERE name = ? AND id != ?`,
            [name, id]
        );
        if (existingCategory.length > 0) {
            return res.status(409).json({
                message: "category name already exists",
                success: false
            })
        }

        // update category
        await db.executeQuery(
            `UPDATE categories SET name = ?, description = ?, image = ? WHERE id = ?`,
            [name, description, image, id]
        );

        // success response
        return res.status(200).json({
            message: "category updated successfully",
            success: true
        })

    } catch (error) {
        console.error("update category by id error:", error.message);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

// deleteCategory
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // check if category exists
        const existingCategory = await db.executeQuery(
            `SELECT id FROM categories WHERE id = ?`,
            [id]
        );

        if (existingCategory.length === 0) {
            return res.status(404).json({
                message: "category not found",
                success: false
            })
        }
        // delete category
        await db.executeQuery(
            `DELETE FROM categories WHERE id = ?`,
            [id]
        )
        // return success
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("delete category:", error.message);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })

    }
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory

};