const express = require('express');
const router = express.Router();

const { createCategory } = require('../controllers/category.controller');
const adminMiddleWare = require('../middleWares/adminMiddleware');
const upload = require('../middleWares/uploadMiddleware');

router.post('/createCategory', adminMiddleWare, upload.single('file'), createCategory);

module.exports = router;