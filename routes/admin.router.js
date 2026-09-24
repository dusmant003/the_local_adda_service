const express = require('express');
const router = express.Router();

const { adminLogin, getAdminProfile, getAllUsers, getUserById, deleteUser, } = require('../controllers/admin.controller');
const adminMiddleWare = require('../middleWares/adminMiddleware');

router.post('/login', adminLogin);
router.get('/profile', adminMiddleWare, getAdminProfile);
router.get('/allusers', adminMiddleWare, getAllUsers);
router.get('/user/:id', adminMiddleWare, getUserById);
router.delete('/deleteUser/:id', adminMiddleWare, deleteUser);

module.exports = router;