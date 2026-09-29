const express = require('express');
const router = express.Router();

const adminMiddleWare = require('../middleWares/adminMiddleware');
const { createFood, getAllFood, getFoodById } = require('../controllers/food.controller');
const upload = require('../middleWares/uploadMiddleware');

router.post('/createFood', adminMiddleWare, upload.single('file'), createFood);
router.get('/allFood', adminMiddleWare, getAllFood);
router.get('/food/:id', adminMiddleWare, getFoodById)



module.exports = router;