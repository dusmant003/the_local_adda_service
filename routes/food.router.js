const express = require('express');
const router = express.Router();

const adminMiddleWare = require('../middleWares/adminMiddleware');
const { createFood, getAllFood, getFoodById, updateFood, deleteFood } = require('../controllers/food.controller');
const upload = require('../middleWares/uploadMiddleware');

router.post('/createFood', adminMiddleWare, upload.single('file'), createFood);
router.get('/allFood', adminMiddleWare, getAllFood);
router.get('/food/:id', adminMiddleWare, getFoodById);
router.put('/updateFood/:id', adminMiddleWare, upload.single('file'), updateFood);
router.delete('/deleteFood/:id', adminMiddleWare, deleteFood);



module.exports = router;