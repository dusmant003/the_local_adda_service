const express = require('express');
const router = express.Router();

const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/category.controller');
const adminMiddleWare = require('../middleWares/adminMiddleware');
const upload = require('../middleWares/uploadMiddleware');

router.post('/createCategory', adminMiddleWare, upload.single('file'), createCategory);
router.get('/allCategories', adminMiddleWare, getAllCategories);
router.get('/category/:id', adminMiddleWare, getCategoryById);
router.put('/updateCategory/:id', adminMiddleWare, upload.single('file'), updateCategory);
router.delete('/deleteCategory/:id', adminMiddleWare , deleteCategory);

module.exports = router;