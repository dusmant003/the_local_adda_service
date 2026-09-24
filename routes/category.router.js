const express = require('express');
const router = express.Router();

const { createCategory } = require('../controllers/categoryController');
const adminMiddleWare = require('../middleWares/adminMiddleware');

router.post('/createCategory', adminMiddleWare, createCategory);

module.exports = router;