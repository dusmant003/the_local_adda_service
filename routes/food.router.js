const express = require('express');
const router = express.Router();

const adminMiddleWare = require('../middleWares/adminMiddleware');
const { createFood } = require('../controllers/food.controller');
const upload = require('../middleWares/uploadMiddleware');

router.post('/createFood', adminMiddleWare, upload.single('file'), createFood);



module.exports = router;