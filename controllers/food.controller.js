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
        const result = await db.executeQuery(
            `SELECT * FROM foods ORDER BY id DESC`
        );
        if (result && result.length > 0) {
            return res.status(200).json({
                message: "Foods fetched successfully",
                success: false,
                foods: result
            })
        } else {
            return res.status(404).json({
                message: "no foods found"
            })
        }

    } catch (error) {
        console.error("get all food error:", error.message);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}
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

module.exports = {
    createFood,
    getAllFood,
    getFoodById
};