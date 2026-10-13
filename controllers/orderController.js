const db = require('../config/db');

// place order
const placeOrder = async (req, res) => {
    try {
        // Get logged-in user ID from JWT
        const user_id = req.user.id;
        const { address_id } = req.body;

        console.log("user_id:", user_id);
        console.log("address_id:", address_id);

        // check if address exists for logged-in user
        const existingAddress = await db.executeQuery(
            `SELECT * FROM addresses WHERE id = ? AND user_id = ?`,
            [address_id, user_id]
        )

        if (existingAddress.length === 0) {
            return res.status(404).json({
                message: "delivery address not found",
                success: false
            })
        }


    } catch (error) {
        console.error("placeOrder error:", error.message);
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}
// Get user's cart items and food prices
const cartItems = await db.executeQuery(
    `SELECT cart.food_id, cart.quantity, foods.price FROM cart
    JOIN foods ON cart.food_id = foods.id WHERE cart.user_id = ?`,
    [user_id]
)

//Check if cart is empty
if (cartItems.length === 0) {
    return res.status(404).json({
        message: "cart is empty",
        success: false
    })
}

// Calculate total amount using database prices
let total_amount = 0;

for (const item of cartItems) {
    totalAmount += Number(item.price) * item.quantity;
}
// create order
const orderResult = await db.executeQuery(
    `INSERT INTO orders (user_id, address_id, total_amount) VALUES (?, ?, ?)`,
    [user_id, address_id, total_amount]
)


module.exports = { 
    placeOrder
}