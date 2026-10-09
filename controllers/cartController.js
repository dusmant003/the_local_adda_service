const db = require('../config/db');


const addToCart = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { food_id, quantity } = req.body;
        console.log("user_id:", user_id);
        console.log("food_id:", food_id);
        console.log("quantity:", quantity);

        // check if food exists
        const food = await db.executeQuery(
            `SELECT * FROM foods WHERE id = ?`,
            [food_id]
        )
        console.log("food:", food);

        // check if food already exists in user's cart
        const existingCart = await db.executeQuery(
            `SELECT * FROM cart WHERE user_id = ? AND food_id = ?`,
            [user_id, food_id]
        )
        console.log("existing cart:", existingCart);


        if (existingCart.length === 0) {
            // add new food to cart
            await db.executeQuery(
                `INSERT INTO cart (user_id, food_id, quantity) VALUES (? , ? , ?)`,
                [user_id, food_id, quantity]
            )
        } else {
            // update quantity of existing food in cart
            await db.executeQuery(
                `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND food_id = ?`,
                [quantity, user_id, food_id]
            );
            return res.status(200).json({
                message: "Cart quantity updated successfully",
                success: true
            });
        }

        //success response
        return res.status(200).json({
            message: "food added to cart successfully",
            success: true
        })

    } catch (error) {
        console.error("add to cart error:", error.message);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

const getMyCart = async (req, res) => {
    try {
        // get logged in user_id from jwt
        const user_id = req.user.id;
        console.log("user_id:", user_id);

        // get cart items from cart table
        const cartItems = await db.executeQuery(
            `SELECT cart.id, cart.user_id, cart.quantity, foods.name,
            foods.image, foods.price FROM cart
            JOIN foods ON cart.food_id = foods.id WHERE cart.user_id = ?`,
            [user_id]
        )

        console.log("my cart:", cartItems);

        // if cart is empty
        if (cartItems.length === 0) {
            return res.status(404).json({
                message: "cart is empty",
                success: false,
                cartItems: []
            })
        }

        // success response
        return res.status(200).json({
            message: "cart fetched successfully",
            success: true,
            cartItems
        })

    } catch (error) {
        console.error("get my cart error:", error.message);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })

    }
}

// update cart by id

const updateCart = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { quantity } = req.body;
        const { id } = req.params;

        console.log("cart_id:", id);
        console.log("user_id:", user_id);
        console.log("quantity:", quantity);

        // // Check if cart item exists for logged-in user
        const existingCart = await db.executeQuery(
            `SELECT * FROM cart WHERE id = ? AND user_id =?`,
            [id, user_id]
        );
        console.log("existing cart:", existingCart);

        if (existingCart.length === 0) {
            return res.status(404).json({
                message: "cart item not found",
                success: false
            });

        }
        // update cart quantity
        await db.executeQuery(
            `UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?`,
            [quantity, id, user_id]
        );

        // success response
        return res.status(200).json({
            message: "cart quantity updated successfully",
            success: true
        })

    } catch (error) {
        console.error("update cart error:", error.message);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

// deleteCart
const removeFromCart = async (req, res) => {
    try {

        // Get cart ID from URL
        const { id } = req.params;

        // Get logged-in user's ID from JWT
        const user_id = req.user.id;

        console.log("cart_id:", id);
        console.log("user_id:", user_id);

        // check if cart item exists for logged-in user
        const existingCart = await db.executeQuery(
            `SELECT * FROM cart WHERE id = ? AND user_id = ?`,
            [id, user_id]
        )

        console.log("existing cart:", existingCart);

        if (existingCart.length === 0) {
            return res.status(404).json({
                message: "cart item not found",
                success: false
            });
        }

        // delete cart item
        await db.executeQuery(
            `DELETE FROM cart WHERE id = ? AND user_id =?`,
            [id, user_id]
        )

        // success response
        return res.status(200).json({
            message: "cart item removed successfully",
            success: true
        })

    } catch (error) {
        console.error("remove from cart error:", error.message);

        return res.status(500).json({
            message: "internal server error",
            success: false
        });
    }
}

module.exports = {
    addToCart,
    getMyCart,
    updateCart,
    removeFromCart
}