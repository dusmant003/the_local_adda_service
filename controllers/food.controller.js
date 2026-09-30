const { Router } = require('express');
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

// getAllFood
const getAllFood = async (req, res) => {
    try {

        // Get keyword and category_id from URL query parameters
        //
        // Example:
        // /allFood?keyword=pizza&category_id=8
        //
        // keyword = "pizza"
        // category_id = "8"
        const { keyword, category_id } = req.query;


        // Check what values are coming from the URL
        console.log("keyword:", keyword);
        console.log("category_id:", category_id);


        // Create a variable to store the database result
        let result;


        // CASE 1:
        // Both keyword and category_id are provided
        //
        // Example:
        // /allFood?keyword=biriyani&category_id=8
        //
        // Find foods where:
        // 1. category_id matches
        // 2. food name contains the keyword
        if (keyword && category_id) {

            result = await db.executeQuery(
                `SELECT * FROM foods
                 WHERE category_id = ? AND name LIKE ?`,
                [category_id, `%${keyword}%`]
            );

            console.log("filter foods:", result);


            // CASE 2:
            // Only category_id is provided
            //
            // Example:
            // /allFood?category_id=8
            //
            // Get all foods from that category
        } else if (category_id) {

            result = await db.executeQuery(
                `SELECT * FROM foods
                 WHERE category_id = ?`,
                [category_id]
            );

            console.log("category foods:", result);


            // CASE 3:
            // Only keyword is provided
            //
            // Example:
            // /allFood?keyword=pizza
            //
            // Search food by name
        } else if (keyword) {

            result = await db.executeQuery(
                `SELECT * FROM foods
                 WHERE name LIKE ?`,
                [`%${keyword}%`]
            );

            console.log("search foods:", result);


            // CASE 4:
            // Neither keyword nor category_id is provided
            //
            // Example:
            // /allFood
            //
            // Get all foods
        } else {

            result = await db.executeQuery(
                `SELECT * FROM foods ORDER BY id DESC`
            );

            console.log("all foods:", result);
        }


        // Check whether any food was found
        if (result && result.length > 0) {

            // Send successful response with food data
            return res.status(200).json({
                message: "Foods fetched successfully",
                success: true,
                foods: result
            });

        } else {

            // No matching food was found
            return res.status(404).json({
                message: "no foods found",
                success: false
            });
        }


    } catch (error) {

        // Handle database or other server errors
        console.error("get all food error:", error.message);

        return res.status(500).json({
            message: "internal server error",
            success: false
        });
    }
};
// getFoodById
const getFoodById = async (req, res) => {
    try {
        // get food from url
        const { id } = req.params;

        // find food by id
        const food = await db.executeQuery(
            `SELECT * FROM foods WHERE id = ?`,
            [id]
        )
        //    check if food exists
        if (food.length === 0) {
            return res.status(404).json({
                message: "Food not found",
                success: false
            })
        }
        // success response
        return res.status(200).json({
            message: "food fetched successfully",
            success: true,
            food: food[0]
        })

    } catch (error) {
        console.error("getFoodById error:", error.message);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

// updateFood

const updateFood = async (req, res) => {
    try {

        // Get food ID from URL
        const { id } = req.params;

        // Get updated food data
        const {
            category_id,
            name,
            description,
            price
        } = req.body;

        console.log("category_id:", category_id);
        // Get uploaded image
        const image = req.file ? req.file.filename : null;


        // Check if food exists
        const food = await db.executeQuery(
            `SELECT * FROM foods WHERE id = ?`,
            [id]
        );

        if (food.length === 0) {
            return res.status(404).json({
                message: "Food not found",
                success: false
            });
        }


        // Check if category exists
        const category = await db.executeQuery(
            `SELECT id FROM categories WHERE id = ?`,
            [category_id]
        );

        if (category.length === 0) {
            return res.status(404).json({
                message: "Category not found",
                success: false
            });
        }

        console.log("category result:", category);

        // Check if food name already exists
        const existingFood = await db.executeQuery(
            `SELECT id FROM foods
             WHERE name = ? AND id != ?`,
            [name, id]
        );

        if (existingFood.length > 0) {
            return res.status(409).json({
                message: "Food name already exists",
                success: false
            });
        }


        // Update food
        if (image) {

            // Update with new image
            await db.executeQuery(
                `UPDATE foods
                 SET category_id = ?,
                     name = ?,
                     description = ?,
                     price = ?,
                     image = ?
                 WHERE id = ?`,
                [
                    category_id,
                    name,
                    description || null,
                    price,
                    image,
                    id
                ]
            );

        } else {

            // Update without changing old image
            await db.executeQuery(
                `UPDATE foods
                 SET category_id = ?,
                     name = ?,
                     description = ?,
                     price = ?
                 WHERE id = ?`,
                [
                    category_id,
                    name,
                    description || null,
                    price,
                    id
                ]
            );
        }


        // Success response
        return res.status(200).json({
            message: "Food updated successfully",
            success: true
        });

    } catch (error) {

        console.error("Update food error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// deleteFood
const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;

        // check if food is exists
        const existingFood = await db.executeQuery(
            `SELECT id FROM foods WHERE id = ?`,
            [id]
        )
        if (existingFood.length === 0) {
            return res.status(404).json({
                message: "food not found",
                success: false
            })
        }

        // delete food from databse
        await db.executeQuery(
            `DELETE FROM foods WHERE id = ?`,
            [id]
        );

        // success response
        return res.status(200).json({
            message: "food deleted successfully",
            success: true
        })


    } catch (error) {
        console.error("delete food error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

module.exports = {
    createFood,
    getAllFood,
    getFoodById,
    updateFood,
    deleteFood
};