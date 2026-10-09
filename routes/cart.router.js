const express = require('express');
const router = express.Router();

const { addToCart, getMyCart, updateCart, removeFromCart, } = require('../controllers/cartController');
const authMiddleWare = require('../middleWares/authMiddleware');

router.post('/addToCart', authMiddleWare, addToCart);
router.get('/getMyCart', authMiddleWare, getMyCart);
router.put('/updateCart/:id', authMiddleWare, updateCart);
router.delete('/removeFromCart/:id', authMiddleWare, removeFromCart);




module.exports = router;